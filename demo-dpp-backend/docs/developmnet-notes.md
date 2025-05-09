Developer notes 

Postman collection info:

https://github.com/sovity/edc-ce/blob/e7daf39088f24a1f645f6741175152697fe60679/docs/Backend/Postman/setting-up-postman.md

Postman collection link: https://raw.githubusercontent.com/sovity/edc-ce/release/v11.0.0/docs/api/postman_collection.json

Explained data transfer types: 
https://github.com/sovity/edc-ce/blob/main/docs/Backend/data-transfer-types.md

https://github.com/eclipse-tractusx/tractusx-edc/blob/main/docs/usage/management-api-walkthrough/07_edrs.md

Connector health check:
https://github.com/sovity/edc-ce/blob/main/docs/Backend/health-check-api.md 


Client wrapper:
https://github.com/sovity/edc-ce/tree/main/connector/ce/libs/api-clients/java-client
https://github.com/sovity/edc-ce/blob/main/docs/SUMMARY.md 

This works: 
curl --location --request POST "http://localhost:22002/api/management/wrapper/ui/pages/contract-agreement-page" --header "X-Api-Key: ApiKeyDefaultValue"

curl.exe --location --request POST "http://localhost:22002/api/management/wrapper/ui/pages/contract-agreement-page" --header "X-Api-Key: ApiKeyDefaultValue"



*** We should implement our own asych mechanis for geting actuall response from a PUSH request 

Review this article https://www.iese.fraunhofer.de/blog/realizing-agricultural-data-spaces/ 
- it seems interested and aligned also withour own scope 

*** Sovity postman collections (check version numbers)

https://github.com/sovity/edc-ce/tree/main/docs/api 


*** Request contracts
curl "http://localhost:22002/api/management/wrapper/ui/pages/contract-agreement-page" -H "Content-Type: application/json" -H "Origin: http://localhost:22000" -H "Referer: http://localhost:22000/" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36" -H "X-Api-Key: ApiKeyDefaultValue" --data-raw "{\"terminationStatus\":\"ONGOING\"}"




*** Request data transfer after contract has been negotiated
curl "http://localhost:22002/api/management/wrapper/ui/pages/contract-agreement-page/transfers" ^
  -H "Content-Type: application/json" ^
  -H "X-Api-Key: ApiKeyDefaultValue" ^
  --data-raw "{\"contractAgreementId\":\"cXVlcnktMw==:cXVlcnktMw==:MDE5NjZiZGUtNjE1Yy03YWE4LTlkZTYtYjFkYTAxNTBiOTU2\",\"dataSinkProperties\":{\"https://w3id.org/edc/v0.0.1/ns/type\":\"HttpData\",\"https://w3id.org/edc/v0.0.1/ns/baseUrl\":\"http://192.168.100.2:8081/log\",\"https://w3id.org/edc/v0.0.1/ns/method\":\"POST\",\"https://w3id.org/edc/v0.0.1/ns/queryParams\":\"\"},\"transferProcessProperties\":{\"https://w3id.org/edc/v0.0.1/ns/method\":\"GET\",\"https://w3id.org/edc/v0.0.1/ns/pathSegments\":\"detail\",\"https://w3id.org/edc/v0.0.1/ns/queryParams\":\"id=1\"}}"


