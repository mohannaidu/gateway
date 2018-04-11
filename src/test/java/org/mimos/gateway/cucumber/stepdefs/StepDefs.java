package org.mimos.gateway.cucumber.stepdefs;

import org.mimos.gateway.GatewayApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = GatewayApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
