package utcluj.aut.demosimpleapp.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import utcluj.aut.demosimpleapp.util.EncryptionUtil;

import javax.crypto.SecretKey;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class EncryptionConfig {

    private static final Logger logger = LoggerFactory.getLogger(EncryptionConfig.class);
    
    @Value("${encryption.key.file:encryption.key}")
    private String keyFilePath;
    
    /**
     * Initialize the encryption key on application startup
     */
    @Bean
    public SecretKey initializeEncryption() {
        try {
            // Create directory for the key file if it doesn't exist
            Path keyFile = Paths.get(keyFilePath);
            Path parent = keyFile.getParent();
            if (parent != null && !Files.exists(parent)) {
                Files.createDirectories(parent);
            }
            
            logger.info("Initializing encryption key from: {}", keyFilePath);
            SecretKey secretKey = EncryptionUtil.initializeEncryptionKey(keyFilePath);
            logger.info("Encryption key initialized successfully");
            
            return secretKey;
        } catch (Exception e) {
            logger.error("Failed to initialize encryption key", e);
            throw new RuntimeException("Failed to initialize encryption key", e);
        }
    }
}
