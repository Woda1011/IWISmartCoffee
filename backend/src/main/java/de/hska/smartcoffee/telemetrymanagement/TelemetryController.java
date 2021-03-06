package de.hska.smartcoffee.telemetrymanagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/telemetry")
public class TelemetryController {

    @Autowired
    private TelemetryRepository telemetryRepository;

    @RequestMapping(method = RequestMethod.GET)
    public Telemetry getLatest() {
        return telemetryRepository.findLatestTelemetry();
    }

    @RequestMapping(method = RequestMethod.POST)
    public Telemetry addTelemetry(@RequestBody Telemetry telemetry) {
        return telemetryRepository.save(telemetry);
    }
}
