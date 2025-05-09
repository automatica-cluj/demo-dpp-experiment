package utcluj.aut.demosimpleapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import utcluj.aut.demosimpleapp.model.DigitalProductPassport;
import utcluj.aut.demosimpleapp.model.RepairEntry;
import utcluj.aut.demosimpleapp.service.DigitalProductPassportService;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dpp")
public class DigitalProductPassportController {

    @Autowired
    private DigitalProductPassportService passportService;
    
    @Value("${encryption.csv.enabled:false}")
    private boolean encryptCsvEnabled;

    @GetMapping("/detail")
    public ResponseEntity<DigitalProductPassport> getPassportById(@RequestParam Long id) {
        return ResponseEntity.ok(passportService.getPassportById(id));
    }

    @GetMapping("/by-serial")
    public ResponseEntity<DigitalProductPassport> getPassportBySerialNumber(@RequestParam String serialNumber) {
        return ResponseEntity.ok(passportService.getPassportBySerialNumber(serialNumber));
    }

    @GetMapping
    public ResponseEntity<List<DigitalProductPassport>> getAllPassports() {
        return ResponseEntity.ok(passportService.getAllPassports());
    }

    @PostMapping
    public ResponseEntity<DigitalProductPassport> createPassport(@RequestBody DigitalProductPassport passport) {
        return ResponseEntity.ok(passportService.createPassport(passport));
    }

    @PostMapping("/repairs")
    public ResponseEntity<RepairEntry> addRepairEntry(
            @RequestParam Long passportId,
            @RequestBody RepairEntry repairEntry) {
        return ResponseEntity.ok(passportService.addRepairEntry(passportId, repairEntry));
    }
    
    @PatchMapping("/csv")
    public ResponseEntity<DigitalProductPassport> updateCsvFileName(
            @RequestParam Long passportId,
            @RequestBody Map<String, String> payload) {
        String csvFileName = payload.get("csvFileName");
        return ResponseEntity.ok(passportService.updateCsvFileName(passportId, csvFileName));
    }

    @PostMapping("/upload-csv")
    public ResponseEntity<?> uploadCsvFile(@RequestParam Long id, @RequestParam("file") MultipartFile file, 
                                         @RequestParam(value = "encrypt", defaultValue = "true") String encryptParam) {
        try {
            boolean encryptFile = Boolean.parseBoolean(encryptParam);
            DigitalProductPassport passport = passportService.uploadCsvFile(id, file, encryptFile);
            Map<String, Object> response = new HashMap<>();
            response.put("passport", passport);
            response.put("encryptionEnabled", passport.isEncrypted());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body("Failed to upload CSV file: " + e.getMessage());
        }
    }

    @GetMapping("/download-csv")
    public ResponseEntity<Resource> downloadCsvFile(@RequestParam Long passportId) {
        try {
            DigitalProductPassport passport = passportService.getPassportById(passportId);
            if (passport.getCsvFileName() == null || passport.getCsvFileName().isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Resource resource = passportService.loadCsvFileAsResource(passportId);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + passport.getCsvFileName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/encryption-status")
    public ResponseEntity<Map<String, Boolean>> getEncryptionStatus() {
        Map<String, Boolean> status = new HashMap<>();
        status.put("csvEncryptionEnabled", encryptCsvEnabled);
        return ResponseEntity.ok(status);
    }
}