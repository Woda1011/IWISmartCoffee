package de.hska.smartcoffee.coffeemanagement;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class CoffeeCoinPdfWriter {

    private static Font titleFont = new Font(Font.FontFamily.TIMES_ROMAN, 18, Font.BOLD);
    private static Font smallBold = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD);
    private static Font small = new Font(Font.FontFamily.TIMES_ROMAN, 12);

    public File generatePdf(List<CoffeeCoin> coffeeCoins) {
        Document document = new Document();
        File tempFile = null;

        try {
            tempFile = File.createTempFile("tempPdf", "smartcoffee");
            PdfWriter.getInstance(document, new FileOutputStream(tempFile));
            document.open();
            addMetaData(document);
            addContent(document, coffeeCoins);
            document.close();
        } catch (IOException | DocumentException e) {
            //TODO Throw error
            e.printStackTrace();
        }

        return tempFile;
    }

    private void addMetaData(Document document) {
        document.addTitle("IWI SmartCoffee Wertmarken");
        document.addCreator("IWI SmartCoffee Application");
        document.addCreationDate();
    }

    private void addContent(Document document, List<CoffeeCoin> coffeeCoins) throws DocumentException {
        Paragraph preface = new Paragraph();
        preface.add(new Paragraph("IWI SmartCoffee Wertmarken", titleFont));
        preface.add(new Paragraph("Generiert von der IWI SmartCoffee Application, " + getFormattedDate() + " Uhr",
                smallBold));
        addEmptyLine(preface, 1);
        preface.add(new Paragraph("Generierte Wertmarken:"));
        addEmptyLine(preface, 1);

        document.add(preface);
        addTable(document, coffeeCoins);
    }

    private String getFormattedDate() {
        SimpleDateFormat formatter = new SimpleDateFormat("dd.MM.yyyy - HH:mm:ss");
        Date now = new Date();
        return formatter.format(now);
    }

    private void addTable(Document document, List<CoffeeCoin> coffeeCoins) throws DocumentException {
        int columns = 2;
        PdfPTable table = new PdfPTable(columns);
        table.setWidthPercentage(100);

        for (int i = 0; i < coffeeCoins.size(); i++) {
            // Creates a new page after 12 elements or 6 rows
            if (i % 12 == 0) {
                if (i > 0) {
                    document.add(table);
                    document.newPage();
                    table = new PdfPTable(columns);
                    table.setWidthPercentage(100);
                }
            }

            // Creates new header row after @colums elements
            if (i % columns == 0) {
                createHeaderRow(columns, table);
            }

            PdfPCell cell = new PdfPCell();
            cell.addElement(new Paragraph("Key (Musst du eingeben):", smallBold));
            cell.addElement(new Paragraph(coffeeCoins.get(i).getCoinKey(), small));
            cell.addElement(new Paragraph("Wert (Anzahl der Kaffee):", smallBold));
            cell.addElement(new Paragraph(String.valueOf(coffeeCoins.get(i).getCoinValue()), small));
            cell.setPadding(5);
            table.addCell(cell);

            // Creates an empty cell if the size of the list is odd (not even)
            if (coffeeCoins.size() % 2 != 0 && i == coffeeCoins.size() - 1) {
                table.addCell(new PdfPCell());
            }
        }

        document.add(table);
    }

    private void createHeaderRow(int columns, PdfPTable table) {
        for (int i = 0; i < columns; i++) {
            PdfPCell cellHeader = new PdfPCell(new Phrase("IWI SmartCoffee Wertmarke", smallBold));
            cellHeader.setHorizontalAlignment(Element.ALIGN_CENTER);
            cellHeader.setPadding(5);
            table.addCell(cellHeader);
            table.setHeaderRows(1);
        }
    }

    private static void addEmptyLine(Paragraph paragraph, int number) {
        for (int i = 0; i < number; i++) {
            paragraph.add(new Paragraph(" "));
        }
    }
}
