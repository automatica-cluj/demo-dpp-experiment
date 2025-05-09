package utcluj.aut.demosimpleapp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import utcluj.aut.demosimpleapp.model.DigitalProductPassport;
import utcluj.aut.demosimpleapp.repository.DigitalProductPassportRepository;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DigitalProductPassportRepository passportRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only insert if repository is empty
        if (passportRepository.count() == 0) {
            DigitalProductPassport passport = new DigitalProductPassport();
            passport.setProductName("Example Product");
            passport.setManufacturer("Example Manufacturer");
            passport.setSerialNumber("SN12345");
            passport.setManufacturingDate(LocalDateTime.of(2023, 1, 1, 0, 0));
            passport.setProductType("Electronics");
            passport.setModelNumber("M-2023");
            
            passportRepository.save(passport);
            
            System.out.println("Initial data inserted.");
        }
    }
}