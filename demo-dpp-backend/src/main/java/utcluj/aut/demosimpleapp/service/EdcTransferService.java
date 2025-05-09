package utcluj.aut.demosimpleapp.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import utcluj.aut.demosimpleapp.model.DataTransfer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Responsible for the initiation of data transfers with the EDC connector. Most of the parts are hardcoded, actually the only part that is not hardcoded is the id of the DPP which is passed as a parameter.
 * This service is specially created for testing DPP transfers with EDC connector.
 * This demo is working with a hardcoded contract agreement ID.
 * The offer is configured on the provider side in a particular way, so the id is accepted as query parameter.
 *
 * In response to the transfer request, the EDC connector will send a POST request to the DATA_SINK_BASE_URL with the data as json
 *
 * NOTE: Data transfer is initiated by using Sovity wrapper API and not EDC API directly.
 */
@Service
public class EdcTransferService {

    @Value("${edc.connector.url:http://localhost:22002}")
    private String edcConnectorUrl;
    
    @Value("${edc.api.key:ApiKeyDefaultValue}")
    private String edcApiKey;
    private static final String CONTRACT_AGREEMENT_ID = "cXVlcnktMw==:cXVlcnktMw==:MDE5NjZiZGUtNjE1Yy03YWE4LTlkZTYtYjFkYTAxNTBiOTU2";
    //private static final String DATA_SINK_BASE_URL = "http://192.168.100.2:8081/log";
    private static final String DATA_SINK_BASE_URL = "http://192.168.100.2:8081/api/data-transfers/json-only";
    private static final int WAIT_SECONDS = 5;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private DataTransferReceiverService dataTransferReceiverService;

    /**
     * Initiates a data transfer with EDC connector and then retrieves the data
     * 
     * @param id The ID to use for both transfer request and reference ID
     * @return List of data transfers retrieved after the EDC transfer is initiated
     */
    public List<DataTransfer> initiateTransferAndRetrieveData(String id) throws Exception {
        // Step 1: Initiate the transfer with EDC
        ResponseEntity<String> edcResponse = initiateEdcTransfer(id);
        
        // Step 2: Wait for the transfer to be processed
        Thread.sleep(WAIT_SECONDS * 1000);
        
        // Step 3: Retrieve the data using the reference ID
        return dataTransferReceiverService.getDataTransfersByReferenceId(id);
    }

    /**
     * Initiates a data transfer with the EDC connector
     * 
     * @param id The ID to use in the query parameters
     * @return Response from the EDC connector
     */
    public ResponseEntity<String> initiateEdcTransfer(String id) throws Exception {
        String endpoint = edcConnectorUrl + "/api/management/wrapper/ui/pages/contract-agreement-page/transfers";
        
        // Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Api-Key", edcApiKey);
        
        // Prepare request payload
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contractAgreementId", CONTRACT_AGREEMENT_ID);
        
        // Data sink properties
        Map<String, String> dataSinkProperties = new HashMap<>();
        dataSinkProperties.put("https://w3id.org/edc/v0.0.1/ns/type", "HttpData");
        dataSinkProperties.put("https://w3id.org/edc/v0.0.1/ns/baseUrl", DATA_SINK_BASE_URL);
        dataSinkProperties.put("https://w3id.org/edc/v0.0.1/ns/method", "POST");
        dataSinkProperties.put("https://w3id.org/edc/v0.0.1/ns/queryParams", "");
        
        // Transfer process properties
        Map<String, String> transferProcessProperties = new HashMap<>();
        transferProcessProperties.put("https://w3id.org/edc/v0.0.1/ns/method", "GET");
        transferProcessProperties.put("https://w3id.org/edc/v0.0.1/ns/pathSegments", "detail");
        transferProcessProperties.put("https://w3id.org/edc/v0.0.1/ns/queryParams", "id=" + id);
        
        requestBody.put("dataSinkProperties", dataSinkProperties);
        requestBody.put("transferProcessProperties", transferProcessProperties);
        
        // Convert to JSON and send request
        String requestJson = objectMapper.writeValueAsString(requestBody);
        HttpEntity<String> requestEntity = new HttpEntity<>(requestJson, headers);
        
        return restTemplate.postForEntity(endpoint, requestEntity, String.class);
    }
    
    /**
     * Asynchronously initiates a transfer and returns a CompletableFuture
     * 
     * @param id The ID to use for both transfer request and reference ID
     * @return CompletableFuture that will complete with the list of data transfers
     */
    public CompletableFuture<List<DataTransfer>> initiateTransferAsync(String id) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return initiateTransferAndRetrieveData(id);
            } catch (Exception e) {
                throw new RuntimeException("Failed to process EDC transfer", e);
            }
        });
    }
}
