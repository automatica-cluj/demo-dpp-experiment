package utcluj.aut.demosimpleapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utcluj.aut.demosimpleapp.model.DataTransfer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DataTransferRepository extends JpaRepository<DataTransfer, Long> {
    
    Optional<DataTransfer> findByTransferId(String transferId);
    
    List<DataTransfer> findByReferenceId(String referenceId);
    
    List<DataTransfer> findByTransferTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    List<DataTransfer> findByReferenceIdAndTransferTimeBetween(String referenceId, LocalDateTime startTime, LocalDateTime endTime);
}