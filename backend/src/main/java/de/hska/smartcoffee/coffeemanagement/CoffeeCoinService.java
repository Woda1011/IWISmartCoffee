package de.hska.smartcoffee.coffeemanagement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Service
public class CoffeeCoinService {

    private static final Logger LOGGER = LoggerFactory.getLogger(CoffeeCoinService.class);
    private final String alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private Random random = new Random();

    @Autowired
    private CoffeeCoinRepository coffeeCoinRepository;

    @Autowired
    private CoffeeCoinPdfWriter coffeeCoinPdfWriter;

    public void writeCoffeeCoinsToResponse(Long coinValue, Long amount, HttpServletResponse response) throws
            IOException {
        List<CoffeeCoin> coffeeCoins = new ArrayList<>();

        for (int i = 0; i < amount; i++) {
            CoffeeCoin coffeeCoin = new CoffeeCoin();
            coffeeCoin.setCoinKey(generateCoinKey());
            coffeeCoin.setCoinValue(coinValue);
            coffeeCoin.setUsed(false);
            coffeeCoin.setCreatedAt(new Date());

//            coffeeCoins.add(coffeeCoin);

            coffeeCoins.add(tryToSaveCoffeeCoin(coffeeCoin));
        }

        File pdfFile = coffeeCoinPdfWriter.generatePdf(coffeeCoins);
        writePdfFileToOutputStream(response, pdfFile);
    }

    private void writePdfFileToOutputStream(HttpServletResponse response, File pdfFile) throws IOException {
        response.setContentType("application/pdf");
        response.addHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=smart_coffee_coins.pdf");
        FileCopyUtils.copy(new FileInputStream(pdfFile), response.getOutputStream());
    }

    private CoffeeCoin tryToSaveCoffeeCoin(CoffeeCoin coffeeCoin) {
        try {
            return coffeeCoinRepository.save(coffeeCoin);
        } catch (Exception ex) {
            LOGGER.error("There was a collision when saving a coffee coin - Generate new key and try again...");
            coffeeCoin.setCoinKey(generateCoinKey());
            return tryToSaveCoffeeCoin(coffeeCoin);
        }
    }

    private String generateCoinKey() {
        String result = "";

        for (int i = 0; i < 19; i++) {
            if (result.length() == 4 || result.length() == 9 || result.length() == 14) {
                result += "-";
            } else {
                result += alphabet.charAt(random.nextInt(alphabet.length()));
            }
        }

        return result;
    }
}
