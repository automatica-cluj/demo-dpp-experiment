package utcluj.aut.demosimpleapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utcluj.aut.demosimpleapp.model.DataTransfer;
import utcluj.aut.demosimpleapp.repository.DataTransferRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * This service class handles the business logic for saving data received as a result of a data transfer initiated by an EDC consumer connector. It  receives data and store it in a database. Data is received when a data transfer is executed with success.
 */
@Service
public class DataTransferReceiverService {

    @Autowired
    private DataTransferRepository dataTransferRepository;

    /**
     * Create a new data transfer record with the provided JSON data
     * 
     * @param referenceId Reference ID (such as product passport ID)
     * @param jsonData JSON data to store
     * @return The created DataTransfer entity
     */
    public DataTransfer createDataTransfer(String referenceId, String jsonData) {
        DataTransfer dataTransfer = new DataTransfer();
        dataTransfer.setTransferId(UUID.randomUUID().toString());
        dataTransfer.setTransferTime(LocalDateTime.now());
        dataTransfer.setReferenceId(referenceId);
        dataTransfer.setJsonData(jsonData);
        
        return dataTransferRepository.save(dataTransfer);
    }

    /**
     * Get a data transfer by its unique transfer ID
     */
    public Optional<DataTransfer> getDataTransferById(Long id) {
        return dataTransferRepository.findById(id);
    }

    /**
     * Get a data transfer by its unique transfer ID string
     */
    public Optional<DataTransfer> getDataTransferByTransferId(String transferId) {
        return dataTransferRepository.findByTransferId(transferId);
    }

    /**
     * Get all data transfers for a specific reference ID
     */
    public List<DataTransfer> getDataTransfersByReferenceId(String referenceId) {
        return dataTransferRepository.findByReferenceId(referenceId);
    }

    /**
     * Get all data transfers that occurred between the specified time period
     */
    public List<DataTransfer> getDataTransfersByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        return dataTransferRepository.findByTransferTimeBetween(startTime, endTime);
    }

    /**
     * Get data transfers for a specific reference ID within a time range
     */
    public List<DataTransfer> getDataTransfersByReferenceIdAndTimeRange(
            String referenceId, LocalDateTime startTime, LocalDateTime endTime) {
        return dataTransferRepository.findByReferenceIdAndTransferTimeBetween(
                referenceId, startTime, endTime);
    }

    /**
     * Get all data transfers
     */
    public List<DataTransfer> getAllDataTransfers() {
        return dataTransferRepository.findAll();
    }

    /**
     * Update the JSON data for an existing data transfer
     */
    public DataTransfer updateJsonData(Long id, String newJsonData) {
        DataTransfer dataTransfer = dataTransferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data transfer not found with id: " + id));
        
        dataTransfer.setJsonData(newJsonData);
        return dataTransferRepository.save(dataTransfer);
    }

    /**
     * Delete a data transfer by ID
     */
    public void deleteDataTransfer(Long id) {
        dataTransferRepository.deleteById(id);
    }
}