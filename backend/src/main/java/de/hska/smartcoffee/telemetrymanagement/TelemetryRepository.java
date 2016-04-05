package de.hska.smartcoffee.telemetrymanagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TelemetryRepository extends JpaRepository<Telemetry, Long> {

    @Query("SELECT t FROM Telemetry t where t.createdAt = (select max(x.createdAt) from Telemetry x)")
    Telemetry findLatestTelemetry();
}
