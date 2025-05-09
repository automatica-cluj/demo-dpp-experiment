package utcluj.aut.demosimpleapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utcluj.aut.demosimpleapp.model.DataTransfer;
import utcluj.aut.demosimpleapp.service.DataTransferReceiverService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/data-transfers")
public class DataTransferReceiverController {

    @Autowired
    private DataTransferReceiverService dataTransferReceiverService;

    /**
     * Create a new data transfer with JSON data and a reference ID
     */
    @PostMapping
    public ResponseEntity<DataTransfer> createDataTransfer(
            @RequestParam String referenceId,
            @RequestBody String jsonData) {
        
        DataTransfer created = dataTransferReceiverService.createDataTransfer(referenceId, jsonData);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Special endpoint that only receives JSON data and uses a default reference ID
     * or an optional provided reference ID
     */
    @PostMapping("/json-only")
    public ResponseEntity<DataTransfer> createDataTransferJsonOnly(
            @RequestParam(required = false) String referenceId,
            @RequestBody String jsonData) {
        String actualReferenceId;
        
        if (referenceId != null && !referenceId.isEmpty()) {
            // Use provided referenceId if it exists
            actualReferenceId = referenceId;
        } else {
            // Try to extract id from the JSON data
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode jsonNode = mapper.readTree(jsonData);
                
                if (jsonNode.has("id")) {
                    String idFromJson = jsonNode.get("id").asText();
                    //actualReferenceId = "json-id-" + idFromJson;
                    actualReferenceId = "" + idFromJson;
                } else {
                    // Leave empty if no id field in JSON
                    actualReferenceId = "";
                }
            } catch (Exception e) {
                // If JSON parsing fails, leave referenceId empty
                actualReferenceId = "";
            }
        }
        
        DataTransfer created = dataTransferReceiverService.createDataTransfer(actualReferenceId, jsonData);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Get a data transfer by its ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<DataTransfer> getDataTransferById(@PathVariable Long id) {
        Optional<DataTransfer> dataTransfer = dataTransferReceiverService.getDataTransferById(id);
        return dataTransfer.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get a data transfer by its transfer ID
     */
    @GetMapping("/by-transfer-id/{transferId}")
    public ResponseEntity<DataTransfer> getDataTransferByTransferId(@PathVariable String transferId) {
        Optional<DataTransfer> dataTransfer = dataTransferReceiverService.getDataTransferByTransferId(transferId);
        return dataTransfer.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all data transfers for a reference ID
     */
    @GetMapping("/by-reference/{referenceId}")
    public ResponseEntity<List<DataTransfer>> getDataTransfersByReferenceId(@PathVariable String referenceId) {
        List<DataTransfer> transfers = dataTransferReceiverService.getDataTransfersByReferenceId(referenceId);
        return ResponseEntity.ok(transfers);
    }

    /**
     * Get data transfers within a time range
     */
    @GetMapping("/by-time")
    public ResponseEntity<List<DataTransfer>> getDataTransfersByTimeRange(
            @RequestParam LocalDateTime startTime,
            @RequestParam LocalDateTime endTime) {
        
        List<DataTransfer> transfers = dataTransferReceiverService.getDataTransfersByTimeRange(startTime, endTime);
        return ResponseEntity.ok(transfers);
    }

    /**
     * Get all data transfers
     */
    @GetMapping
    public ResponseEntity<List<DataTransfer>> getAllDataTransfers() {
        List<DataTransfer> transfers = dataTransferReceiverService.getAllDataTransfers();
        return ResponseEntity.ok(transfers);
    }

    /**
     * Update the JSON data for an existing transfer
     */
    @PutMapping("/{id}")
    public ResponseEntity<DataTransfer> updateJsonData(
            @PathVariable Long id,
            @RequestBody String newJsonData) {
        
        try {
            DataTransfer updated = dataTransferReceiverService.updateJsonData(id, newJsonData);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete a data transfer
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDataTransfer(@PathVariable Long id) {
        dataTransferReceiverService.deleteDataTransfer(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Data transfer deleted successfully");
        return ResponseEntity.ok(response);
    }
}