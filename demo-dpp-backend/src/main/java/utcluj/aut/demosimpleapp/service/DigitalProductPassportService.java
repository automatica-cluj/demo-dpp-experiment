package utcluj.aut.demosimpleapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import utcluj.aut.demosimpleapp.model.DigitalProductPassport;
import utcluj.aut.demosimpleapp.model.RepairEntry;
import utcluj.aut.demosimpleapp.repository.DigitalProductPassportRepository;
import utcluj.aut.demosimpleapp.util.EncryptionUtil;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class DigitalProductPassportService {

    @Autowired
    private DigitalProductPassportRepository passportRepository;
    
    // Path to store uploaded files
    private final Path uploadsDir;
    
    // Map to store original filenames to UUIDs
    private Map<Long, String> passportToFileMap = new java.util.concurrent.ConcurrentHashMap<>();
    
    // Whether to encrypt CSV files
    @Value("${encryption.csv.enabled:false}")
    private boolean encryptCsvEnabled;

    public DigitalProductPassportService() {
        // Create uploads directory if it doesn't exist
        this.uploadsDir = Paths.get("uploads");
        try {
            if (!Files.exists(uploadsDir)) {
                Files.createDirectories(uploadsDir);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create uploads directory", e);
        }
    }

    public DigitalProductPassport getPassportById(Long id) {
        return passportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passport not found with id: " + id));
    }

    public DigitalProductPassport getPassportBySerialNumber(String serialNumber) {
        DigitalProductPassport passport = passportRepository.findBySerialNumber(serialNumber);
        if (passport == null) {
            throw new RuntimeException("Passport not found with serial number: " + serialNumber);
        }
        return passport;
    }

    public List<DigitalProductPassport> getAllPassports() {
        return passportRepository.findAll();
    }

    public DigitalProductPassport createPassport(DigitalProductPassport passport) {
        return passportRepository.save(passport);
    }

    public RepairEntry addRepairEntry(Long passportId, RepairEntry repairEntry) {
        DigitalProductPassport passport = getPassportById(passportId);
        repairEntry.setPassport(passport);
        passport.getRepairHistory().add(repairEntry);
        passportRepository.save(passport);
        return repairEntry;
    }
    
    // New method to update CSV file name
    public DigitalProductPassport updateCsvFileName(Long passportId, String csvFileName) {
        DigitalProductPassport passport = getPassportById(passportId);
        passport.setCsvFileName(csvFileName);
        return passportRepository.save(passport);
    }

    // Method to handle CSV file upload
    public DigitalProductPassport uploadCsvFile(Long passportId, MultipartFile file, boolean encryptFile) throws IOException {
        DigitalProductPassport passport = getPassportById(passportId);
        
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Failed to store empty file");
        }
        
        // Generate a unique filename to prevent overwriting existing files
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf('.')) : ".csv";
        String newFilename = UUID.randomUUID().toString() + fileExtension;
        
        // Store the file in the uploads directory
        Path destinationFile = uploadsDir.resolve(
                Paths.get(newFilename))
                .normalize().toAbsolutePath();
        
        // Make sure the destination is inside the uploads directory (security check)
        if (!destinationFile.getParent().equals(uploadsDir.toAbsolutePath())) {
            throw new SecurityException("Cannot store file outside of uploads directory");
        }
        
        // Check if we need to encrypt the file 
        if (encryptFile) {
            // Read file content
            String fileContent = new String(file.getBytes(), StandardCharsets.UTF_8);
            
            // Encrypt the content
            String encryptedContent = EncryptionUtil.encrypt(fileContent);
            
            // Write encrypted content to file
            Files.write(destinationFile, encryptedContent.getBytes(StandardCharsets.UTF_8));
            
            // Mark file as encrypted by adding a flag to the passport
            passport.setEncrypted(true);
        } else {
            // Save the file as-is
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
            passport.setEncrypted(false);
        }
        
        // Store the mapping between passport ID and UUID filename
        passportToFileMap.put(passport.getId(), newFilename);
        
        // Update the passport with the new file name
        passport.setCsvFileName(originalFilename != null ? originalFilename : newFilename);
        return passportRepository.save(passport);
    }

    // Method to load the CSV file as a resource 
    public Resource loadCsvFileAsResource(Long passportId) throws MalformedURLException, IOException {
        DigitalProductPassport passport = getPassportById(passportId);
        
        // Find the UUID filename for this passport's CSV file
        String uuidFilename = findFileForPassport(passport);
        
        if (uuidFilename == null) {
            throw new RuntimeException("File not found for passport: " + passportId);
        }
        
        Path filePath = uploadsDir.resolve(uuidFilename).normalize();
        
        // Check if the file is encrypted and needs decryption
        if (passport.isEncrypted()) {
            // Read the encrypted content
            String encryptedContent = new String(Files.readAllBytes(filePath), StandardCharsets.UTF_8);

            // Decrypt the content
            String decryptedContent = EncryptionUtil.decrypt(encryptedContent);

            // Return as a resource
            return new org.springframework.core.io.InputStreamResource(
                new ByteArrayInputStream(decryptedContent.getBytes(StandardCharsets.UTF_8)));
        } else {
            // Return the file as-is
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found: " + uuidFilename);
            }
       }
    }
    
    // Helper method to find the UUID filename for a passport
    private String findFileForPassport(DigitalProductPassport passport) {
        // First check if we have it in our map
        String filename = passportToFileMap.get(passport.getId());
        if (filename != null) {
            return filename;
        }
        
        // Otherwise, we need to search for files that might match
        try {
            // List all files in the uploads directory
            List<Path> files = Files.list(uploadsDir).toList();
            
            // If there's only one file and no mappings, assume it's for this passport
            if (passport.getCsvFileName() != null && !passport.getCsvFileName().isEmpty()) {
                // Look for any UUID files
                for (Path file : files) {
                    String fileName = file.getFileName().toString();
                    if (fileName.contains("-") && fileName.endsWith(".csv")) {
                        // Store in map for future reference
                        passportToFileMap.put(passport.getId(), fileName);
                        return fileName;
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        return null;
    }
}