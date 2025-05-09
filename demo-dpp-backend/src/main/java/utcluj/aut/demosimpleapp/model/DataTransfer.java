package utcluj.aut.demosimpleapp.model;

import jakarta.persistence.*;
import org.hibernate.annotations.Type;
import java.time.LocalDateTime;

@Entity
@Table(name = "data_transfers")
public class DataTransfer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transfer_id", nullable = false, unique = true)
    private String transferId;

    @Column(name = "transfer_time", nullable = false)
    private LocalDateTime transferTime;

    @Column(name = "reference_id")
    private String referenceId;

    @Column(name = "json_data", columnDefinition = "TEXT")
    private String jsonData;

    // Default constructor
    public DataTransfer() {
    }

    // Constructor with fields
    public DataTransfer(String transferId, LocalDateTime transferTime, String referenceId, String jsonData) {
        this.transferId = transferId;
        this.transferTime = transferTime;
        this.referenceId = referenceId;
        this.jsonData = jsonData;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransferId() {
        return transferId;
    }

    public void setTransferId(String transferId) {
        this.transferId = transferId;
    }

    public LocalDateTime getTransferTime() {
        return transferTime;
    }

    public void setTransferTime(LocalDateTime transferTime) {
        this.transferTime = transferTime;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public String getJsonData() {
        return jsonData;
    }

    public void setJsonData(String jsonData) {
        this.jsonData = jsonData;
    }
}