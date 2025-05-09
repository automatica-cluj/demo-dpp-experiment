package utcluj.aut.demosimpleapp.util;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class EncryptionUtil {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";
    private static final int KEY_SIZE = 128; // 128-bit AES
    private static SecretKey secretKey;

    /**
     * Initialize the encryption key from a file or generate a new one if needed
     * @param keyFilePath Path to the encryption key file
     * @return The initialized secret key
     */
    public static SecretKey initializeEncryptionKey(String keyFilePath) {
        try {
            Path path = Paths.get(keyFilePath);
            
            // If the file doesn't exist, generate a new key and save it
            if (!Files.exists(path)) {
                secretKey = generateKey();
                saveKeyToFile(secretKey, path);
            } else {
                // Load existing key from file
                byte[] keyBytes = Files.readAllBytes(path);
                secretKey = new SecretKeySpec(keyBytes, ALGORITHM);
            }
            
            return secretKey;
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize encryption key", e);
        }
    }
    
    /**
     * Generate a new AES encryption key
     * @return The generated SecretKey
     */
    private static SecretKey generateKey() throws NoSuchAlgorithmException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance(ALGORITHM);
        keyGenerator.init(KEY_SIZE);
        return keyGenerator.generateKey();
    }
    
    /**
     * Save the encryption key to a file
     * @param key The secret key to save
     * @param path The path where to save the key
     */
    private static void saveKeyToFile(SecretKey key, Path path) throws Exception {
        byte[] keyBytes = key.getEncoded();
        Files.write(path, keyBytes);
    }
    
    /**
     * Encrypt data using the initialized secret key
     * @param data Data to encrypt
     * @return Base64-encoded encrypted data
     */
    public static String encrypt(String data) {
        try {
            if (secretKey == null) {
                throw new IllegalStateException("Encryption key has not been initialized");
            }
            
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encryptedBytes = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }
    
    /**
     * Decrypt data using the initialized secret key
     * @param encryptedData Base64-encoded encrypted data
     * @return Decrypted data as string
     */
    public static String decrypt(String encryptedData) {
        try {
            if (secretKey == null) {
                throw new IllegalStateException("Encryption key has not been initialized");
            }
            
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decodedBytes = Base64.getDecoder().decode(encryptedData);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }
}
