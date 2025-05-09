package utcluj.aut.demosimpleapp.controller;

import org.springframework.web.bind.annotation.*;
import utcluj.aut.demosimpleapp.util.EncryptionUtil;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for handling encryption and decryption requests. This is a demo only and should not be used in production.
 */
@RestController
@RequestMapping("/api/encryption")
public class EncryptionController {

    @PostMapping("/encrypt")
    public Map<String, String> encryptData(@RequestBody Map<String, String> payload) {
        String plainText = payload.get("plainText");
        if (plainText == null || plainText.isEmpty()) {
            throw new IllegalArgumentException("Plain text cannot be empty");
        }
        
        String encrypted = EncryptionUtil.encrypt(plainText);
        
        Map<String, String> response = new HashMap<>();
        response.put("encrypted", encrypted);
        return response;
    }
    
    @PostMapping("/decrypt")
    public Map<String, String> decryptData(@RequestBody Map<String, String> payload) {
        String encryptedText = payload.get("encryptedText");
        if (encryptedText == null || encryptedText.isEmpty()) {
            throw new IllegalArgumentException("Encrypted text cannot be empty");
        }
        
        String decrypted = EncryptionUtil.decrypt(encryptedText);
        
        Map<String, String> response = new HashMap<>();
        response.put("decrypted", decrypted);
        return response;
    }
}
