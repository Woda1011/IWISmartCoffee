package de.hska.smartcoffee.telemetrymanagement;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
public class Telemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column
    private Float temperature;

    @Column
    private Long fillLevel;

    @Column
    private boolean isBrewing;

    @Column
    @NotNull
    private Date createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getTemperature() {
        return temperature;
    }

    public void setTemperature(Float temperature) {
        this.temperature = temperature;
    }

    public Long getFillLevel() {
        return fillLevel;
    }

    public void setFillLevel(Long fillLevel) {
        this.fillLevel = fillLevel;
    }

    public boolean getIsBrewing() {
        return isBrewing;
    }

    public void setBrewing(boolean isBrewing) {
        this.isBrewing = isBrewing;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
