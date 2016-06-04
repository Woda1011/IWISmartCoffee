package de.hska.smartcoffee.studentmanagement.campuscard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/campuscard")
public class CampusCardController {

    @Autowired
    private CampusCardHandler cardHandler;

    @RequestMapping(method = RequestMethod.GET)
    public void removeCampusCardFromWebsocket() {
        cardHandler.removeCampusCard();
    }
}
