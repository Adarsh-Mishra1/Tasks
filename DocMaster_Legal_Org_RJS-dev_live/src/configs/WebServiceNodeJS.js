// export const webServiceGateWay="http://localhost:9003/" //LocalHostNode
export const webServiceGateWay = "https://www.testserver.docmaster.in:9003/"; //LiveHostNode

//*MWS: Micro Web Service
/*MWS:DocForms(GU)*/
const webServiceOrganisation = "organisation";
export const WSCreateDocFormCategory =
  webServiceGateWay + webServiceOrganisation + "/createDocFormCategory"; //Node
export const WSReadDocFormCategories =
  webServiceGateWay + webServiceOrganisation + "/readDocFormCategories"; //Node
export const WSUpdateDocFormCategory =
  webServiceGateWay + webServiceOrganisation + "/updateDocFormCategory"; //Node
export const WSDeleteDocFormCategory =
  webServiceGateWay + webServiceOrganisation + "/deleteDocFormCategory"; //Node
