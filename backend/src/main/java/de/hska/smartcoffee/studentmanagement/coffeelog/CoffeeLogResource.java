package de.hska.smartcoffee.studentmanagement.coffeelog;

public class CoffeeLogResource {

    private Long quota;
    private Float averageConsumption;

    public CoffeeLogResource() {
    }

    public CoffeeLogResource(Long quota, Float averageConsumption) {
        this.quota = quota;
        this.averageConsumption = averageConsumption;
    }

    public Long getQuota() {
        return quota;
    }

    public void setQuota(Long quota) {
        this.quota = quota;
    }

    public Float getAverageConsumption() {
        return averageConsumption;
    }

    public void setAverageConsumption(Float averageConsumption) {
        this.averageConsumption = averageConsumption;
    }
}
