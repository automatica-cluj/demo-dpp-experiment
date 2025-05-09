package utcluj.aut.demosimpleapp.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;

@RestController
public class LoggerController {

    @PostMapping("/log")
    public String logMessage(@RequestBody String message) {
        // Log to console
        System.out.println("Received message: " + message);

        // Log to file
        try (FileWriter writer = new FileWriter("log.txt", true)) {
            writer.write(LocalDateTime.now() + " - " + message + System.lineSeparator());
        } catch (IOException e) {
            e.printStackTrace();
            return "Failed to log message.";
        }

        return "Message logged successfully.";
    }
}
