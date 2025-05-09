package utcluj.aut.demosimpleapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import utcluj.aut.demosimpleapp.model.DigitalProductPassport;

public interface DigitalProductPassportRepository extends JpaRepository<DigitalProductPassport, Long> {
    DigitalProductPassport findBySerialNumber(String serialNumber);
} 