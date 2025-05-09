package utcluj.aut.demosimpleapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utcluj.aut.demosimpleapp.model.DataTransfer;
import utcluj.aut.demosimpleapp.service.EdcTransferService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/edc-transfer")
public class EdcTransferController {

    @Autowired
    private EdcTransferService edcTransferService;

    /**
     * Initiates a data transfer with EDC connector and retrieves the data 
     * after waiting for a few seconds.
     * 
     * @param id The ID to use for the transfer and for retrieving data
     * @return List of data transfers
     */
    @PostMapping("/initiate/{id}")
    public ResponseEntity<List<DataTransfer>> initiateTransfer(@PathVariable String id) {
        try {
            List<DataTransfer> transfers = edcTransferService.initiateTransferAndRetrieveData(id);
            return ResponseEntity.ok(transfers);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Initiates a data transfer asynchronously and immediately returns a response,
     * client can poll for results using the DataTransferReceiverController endpoints.
     * 
     * @param id The ID to use for the transfer
     * @return Status message
     */
    @PostMapping("/initiate-async/{id}")
    public ResponseEntity<Map<String, String>> initiateTransferAsync(@PathVariable String id) {
        CompletableFuture<List<DataTransfer>> future = edcTransferService.initiateTransferAsync(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "Transfer initiated");
        response.put("referenceId", id);
        response.put("message", "You can retrieve the data using the /api/data-transfers/by-reference/" + id + " endpoint");
        
        return ResponseEntity.ok(response);
    }
}
