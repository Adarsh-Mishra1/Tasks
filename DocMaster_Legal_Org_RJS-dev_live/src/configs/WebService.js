import { webServiceGateWay, webServiceGateWayLcl } from "./WebServiceUrl";

const wsUser = "user";
// const wsUserNew = "user_new";
const wsUserNew = "users_new";
const wsUsers = "users";
const wsUsersNew = "users_new";
export const WSCheckForLogOutFromAllFlag =
  webServiceGateWay + wsUser + "/checkForLogOutFromAllFlag"; //#155
// export const WSCheckForLogOutFromAllFlag =
//   webServiceGateWay + "user-n" + "/checkForLogOutFromAllFlag"; //#155
export const WSsendemail = webServiceGateWay + wsUserNew + "/send-email";
export const WSsendOTP = webServiceGateWay + wsUsers + "/sendOTP";
// export const WSregistrationLegal =
//   "http://localhost:8080/user/general/registrationLegal";
export const WSregistrationLegal =
  webServiceGateWay + wsUserNew + "/general/registrationLegal";
// export const WSUserForgotPassword =
//   "http://localhost:8080/user/general/forgotPassword";
export const WSUserForgotPassword =
  webServiceGateWay + wsUserNew + "/general/forgotPassword";
// export const WSUserForgotPassword =
//   webServiceGateWay + wsUser + "/general/forgotPassword";
export const WSUserPasswordReset =
  webServiceGateWay + wsUser + "/general/passwordReset";
 export const WSGeneralUserResendOTP =
   webServiceGateWay + wsUserNew + "/general/resendVerificationOTP";
  export const WSGeneralUsernodejs =
  "https://web1024.ipguide.net:5000/send-email";
export const WsSendOTP = webServiceGateWay + wsUsers + "/sendOTP";
export const WSverifyOTP = webServiceGateWay + wsUserNew + "/general/verifyOTP";

export const WSverifyOTPClient =
  webServiceGateWay + wsUsersNew + "/general/verifyOTPNew"; //live
// export const WSverifyOTPClient = "http://localhost:8080/user_new/general/verifyOTPNew"; // local

export const WSsentOTPClient =
  webServiceGateWay + wsUsersNew + "/general/forgotPasswordNew"; //live
  export const WSuser_order =
  webServiceGateWay + wsUsersNew + "/general/userOrder"; //live
// export const WSsentOTPClient = "http://localhost:8080/user_new/general/forgotPasswordNew"; // local
// export const WSresentOTP =
//   "http://localhost:8080/user/general/resendVerificationOTP";
export const WSresentOTP =
  webServiceGateWay + wsUserNew + "/general/resendVerificationOTP";
//ORGWS: Micro Web Service
const wsOrganisation = "organisation";
const new_wsOrganisation = "organisation_new";
const wsOrganisation_n = "organisation_n";
export const WSPutorgNew = webServiceGateWay + new_wsOrganisation + "/putOrg";
export const WSPutOrgUserLimit =
  webServiceGateWay + wsOrganisation + "/putOrgUsersLimit";

// export const WSLogIn = webServiceGateWay + "organisation-n" + "/login"; //#180
export const WSLogIn = webServiceGateWay + wsOrganisation_n + "/login"; //#180
// export const WSLogIn = webServiceGateWay + wsOrganisation + "/login";
export const WSPutDocFormDetail =
  webServiceGateWay + wsOrganisation + "/putDocFormDetails"; //#182
export const WSApproveDocForm =
  webServiceGateWay + wsOrganisation + "/approveDocForm"; //#185
export const WSPublishDocForm =
  webServiceGateWay + wsOrganisation + "/publishDocForm"; //#186
export const WSGetAllDocForm =
  webServiceGateWay + wsOrganisation + "/getAllDocForm"; //#187
export const WSGetDocForm = webServiceGateWay + wsOrganisation + "/getDocForm"; //#188
export const WSGetOrgDocForms =
  webServiceGateWay + wsOrganisation + "/getOrgDocForms"; //#192
export const WSCreateDocFormCategory =
  webServiceGateWay + wsOrganisation + "/createDocFormCategory"; //#221
export const WSReadDocFormCategories =
  webServiceGateWay + wsOrganisation + "/readDocFormCategories"; //#222
export const WSUpdateDocFormCategory =
  webServiceGateWay + wsOrganisation + "/updateDocFormCategory"; //#223
export const WSDeleteDocFormCategory =
  webServiceGateWay + wsOrganisation + "/deleteDocFormCategory"; //#224
export const WsOrgUsers = webServiceGateWay + wsOrganisation + "/orgUsers"; //#278
export const WsGetOrgDocFormUsageStats =
  webServiceGateWay + wsOrganisation + "/getOrgDocFormUsageStats"; //#300 GET [URL/orgId/type]
export const WsGetOrgDocFormUsages =
  webServiceGateWay + wsOrganisation + "/getOrgDocFormUsages"; //#301 GET [URL/orgId]
export const WsGetOrgDocFormUsageData =
  webServiceGateWay + wsOrganisation + "/getOrgDocFormUsageData"; //#302 GET [URL/orgId/type/id]

export const WsPutDepartment =
  webServiceGateWay + wsOrganisation + "/putDepartment"; //#303 POST
export const WsGetDepartmentByOrg =
  webServiceGateWay + wsOrganisation + "/getDepartmentByOrg"; //#304 GET [URL/orgId/userId]
export const WsPutOrgUserDepartmentMap =
  webServiceGateWay + wsOrganisation + "/putOrgUserDepartmentMap"; //#305 POST
export const WsGetOrgDepartmentsByUser =
  webServiceGateWay + wsOrganisation + "/getOrgDepartmentsByUser"; //#306 GET [URL/orgId/userId]
export const WsGetOrgUsersByDepartment =
  webServiceGateWay + wsOrganisation + "/getOrgUsersByDepartment"; //#307 GET [URL/orgId/departmentId]
export const WsPutOrgDocFormDepartmentMap =
  webServiceGateWay + wsOrganisation + "/putOrgDocFormDepartmentMap"; //#308 POST
export const WsGetOrgDocFormsByDepartment =
  webServiceGateWay + wsOrganisation + "/getOrgDocFormsByDepartment"; //#303 GET [URL/orgId/departmentId]
export const WsGetOrgDepartmentsByDocForm =
  webServiceGateWay + wsOrganisation + "/getOrgDepartmentsByDocForm"; //#315 GET [URL/orgId/docFormId]
export const WsDeleteOrgDocFormDepartmentMap =
  webServiceGateWay + wsOrganisation + "/deleteOrgDocFormDepartmentMap"; //#315 GET [URL/orgId/docFormId]
export const WsUpdateUser = webServiceGateWay + wsOrganisation + "/updateUser"; //#317 POST
export const WsDeleteDocForm =
  webServiceGateWay + wsOrganisation + "/deleteDocForm"; //#318 POST
export const WsRemoveUser = webServiceGateWay + wsOrganisation + "/removeUser"; //#323 POST
export const WsUpdateUserRole =
  webServiceGateWay + wsOrganisation + "/updateUserRole"; //#NotListed POST
export const WsGetOrgDocFormDepartmentMap =
  webServiceGateWay + wsOrganisation + "/getOrgDocFormDepartmentMap"; //#320 GET [URL/orgId/userId]
export const WsGetOrgUserDepartmentMap =
  webServiceGateWay + wsOrganisation + "/getOrgUserDepartmentMap"; //#321 GET [URL/orgId/userId]
export const WsDeleteOrgUserDepartmentMap =
  webServiceGateWay + wsOrganisation + "/deleteOrgUserDepartmentMap"; //#322 POST

// const webServiceOrganisation="organisation"
// export const WSCreateDocFormCategory=webServiceGateWay+webServiceOrganisation+"/createDocFormCategory" //Node
// export const WSReadDocFormCategories=webServiceGateWay+webServiceOrganisation+"/readDocFormCategories" //Node
// export const WSUpdateDocFormCategory=webServiceGateWay+webServiceOrganisation+"/updateDocFormCategory" //Node
// export const WSDeleteDocFormCategory=webServiceGateWay+webServiceOrganisation+"/deleteDocFormCategory" //Node

//DevNote[Remark]:This WS Will Have to be changed to
export const WSCheckDocFormLimitV3 =
  webServiceGateWay + wsOrganisation + "/readDocLanguages"; //JAVA

export const WSPutOrgDocFormUserInputData =
  webServiceGateWay + wsOrganisation + "/putOrgDocFormUserInputData"; //#200
export const WSGetMyFilledOrgDocForms =
  webServiceGateWay + wsOrganisation + "/getMyFilledOrgDocForms"; //#201 [url/userId]
export const WSGetMyFilledOrgDocForm =
  webServiceGateWay + wsOrganisation + "/getMyFilledOrgDocForm"; //#202 [url/userId/recId]
export const WSDeleteMyFilledOrgDocForm =
  webServiceGateWay + wsOrganisation + "/deleteMyFilledOrgDocForm"; //#216 [url/userId/recId]

export const WSGetOrgDocFormFilled =
  webServiceGateWay + wsOrganisation + "/getOrgDocFormFilled"; //217 [url/orgFormId/submitted]
export const WSGetOrgDocFormFilledData =
  webServiceGateWay + wsOrganisation + "/getOrgDocFormFilledData"; //218 [url/recId]
export const WSDeleteFilledOrgDocForm =
  webServiceGateWay + wsOrganisation + "/deleteFilledOrgDocForm"; //#219 [url/userId/recId]
export const WSCopyDocFormData =
  webServiceGateWay + wsOrganisation + "/copyDocFormData"; //#220 [POST]

export const WSDocFormsConnectionTest = webServiceGateWay + wsOrganisation;
export const WSPutDocFormFieldsTemplate =
  webServiceGateWay + wsOrganisation + "/putDocFormFieldsTemplate"; //#183
export const WSApproveDocFormFieldAndTemplate =
  webServiceGateWay + wsOrganisation + "/approveDocFormFieldAndTemplate"; //#184
export const WSGetDocFormFieldsTemplate =
  webServiceGateWay + wsOrganisation + "/getDocFormFieldsTemplate"; //#189

export const WSAddUser = webServiceGateWay + wsOrganisation + "/addUser"; //#191
export const WSGetOrgUsers =
  webServiceGateWay + wsOrganisation + "/getOrgUsers"; //#192
export const WSGetOrgUserDetail =
  webServiceGateWay + wsOrganisation + "/getOrgUserDetail"; //ToDo

export const WSAddUserGroup =
  webServiceGateWay + wsOrganisation + "/addUserGroup"; //#193
export const WSGetUserGroups =
  webServiceGateWay + wsOrganisation + "/getUserGroups"; //#194
export const WSAddUserToGroup =
  webServiceGateWay + wsOrganisation + "/addUserToGroup"; //#198
export const WSGetOrgGroupMembers =
  webServiceGateWay + wsOrganisation + "/getOrgGroupMembers"; //#199

export const WSGetOrgUserCrudAccess =
  webServiceGateWay + wsOrganisation + "/getOrgUserCrudAccess"; //196
export const WSPutOrgUserCrudAccess =
  webServiceGateWay + wsOrganisation + "/putOrgUserCrudAccess"; //197

export const WsPutOrgPreFillField =
  webServiceGateWay + wsOrganisation + "/putOrgPreFillField"; //287
export const WsGetOrgPreFillField =
  webServiceGateWay + wsOrganisation + "/getOrgPreFillField"; //288
export const WsGetOrgUserPreFillField =
  webServiceGateWay + wsOrganisation + "/getOrgUserPreFillField"; //289
export const WsGetPreFillKeysByType =
  webServiceGateWay + wsOrganisation + "/getPreFillKeysByType"; //292
export const WsGetOrgPreFillFieldValue =
  webServiceGateWay + wsOrganisation + "/getOrgPreFillFieldValue"; //292

/*MWS:DocFormsMaster*/
const wsDocFormMaster = "docforms_master";
//DocFormCategory
// export const WSCategoryAll=webServiceGateWay+wsDocFormMaster+"/readCategories" //#17
export const WSReadRoles = webServiceGateWay + wsDocFormMaster + "/readRoles"; //#10
//DocumentNature
// export const WSDocNatureReadAll=webServiceGateWay+wsDocFormMaster+"/readDocNatures" //JAVA
// export const WSDocClassReadAll=webServiceGateWay+wsDocFormMaster+"/readDocClasses" //JAVA

/*
const wsPriceQuotation="pricequotation"
export const WSGetBrands=webServiceGateWay+wsPriceQuotation+"/getItemBrands" //JAVA
export const WSGetCategories=webServiceGateWay+wsPriceQuotation+"/getItemCategories" //JAVA
export const WSGetTypes=webServiceGateWay+wsPriceQuotation+"/getItemTypes" //JAVA
export const WSPutItem=webServiceGateWay+wsPriceQuotation+"/putItem" //JAVA
export const WSGetItemsByOrg=webServiceGateWay+wsPriceQuotation+"/getItemsByOrg" //JAVA/{orgId}
export const WSGetQuotationsByOrg=webServiceGateWay+wsPriceQuotation+"/getQuotationsByOrg" //JAVA
export const WSPutQuotation=webServiceGateWay+wsPriceQuotation+"/putQuotation" //JAVA
export const WSGetQuotation=webServiceGateWay+wsPriceQuotation+"/getQuotation" //JAVA //{quoteId}/{userId}
export const WSGetSubQuotationsByOrg=webServiceGateWay+wsPriceQuotation+"/getSubQuotationsByOrg" //JAVA //{orgId}/{parentQuoteId}/{userId}
export const WSGetQuotationItemsByQuoteId=webServiceGateWay+wsPriceQuotation+"/getQuotationItemsByQuoteId" //JAVA //{quoteId}/{orgId}/{userId}
export const WSPutQuotationItem=webServiceGateWay+wsPriceQuotation+"/putQuotationItem" //JAVA 
export const WSDeleteQuotationItem=webServiceGateWay+wsPriceQuotation+"/deleteQuotationItem" //JAVA
export const WSDeleteQuotation=webServiceGateWay+wsPriceQuotation+"/deleteQuotation" //JAVA
export const WSGetSubQuotationItems=webServiceGateWay+wsPriceQuotation+"/getSubQuotationItems" //JAVA{quoteId}/{orgId}/{userId}
export const WsCopyQuotation=webServiceGateWay+wsPriceQuotation+"/copyQuotation" //POST #324
export const WsGetSubQuotations=webServiceGateWay+wsPriceQuotation+"/getSubQuotations" //GET #325 //{orgId}/{userId}/{rootQuoteId}
*/
const wbResearch = "dm_research"; //deployed
const new_wbResearch = "dm_research_new"; //deployed

// const wbResearch = ""; //Testing
// const wbResearchLcl = ""; //Testing
// export const WsUserLogIn = webServiceGateWay+ wbResearch + "/login"; //Post
// export const WsUserChangePassword = webServiceGateWay+ wbResearch + "/changePassword"; //Post
export const WsGetResearchSubjectsPreset =
  webServiceGateWay + wbResearch + "/getResearchSubjectsPreset"; //Get
export const WsGetResearchSubjectByUser =
  webServiceGateWay + wbResearch + "/getResearchSubjectByUser"; //Get ///getResearchSubjectByUser/{userId}/{subjectId}
export const WsCopyResearchSubjectPresetForUser =
  webServiceGateWay + wbResearch + "/copyResearchSubjectPresetForUser"; //Post
export const WsPutResearchSubject =
  webServiceGateWay + wbResearch + "/putResearchSubject"; //Post
export const WsGetUserSubjectQuestionAndAnswer =
  webServiceGateWay + wbResearch + "/getUserSubjectQuestionAndAnswer"; //get /{subjectId}/{userId}/{level}
export const WsPutResearchQuestion =
  webServiceGateWay + wbResearch + "/putResearchQuestion"; //Post
export const WsPutResearchQuestionAnswer =
  webServiceGateWay + wbResearch + "/putResearchQuestionAnswer"; //Post
export const WsDeleteResearchQuestionAnswer =
  webServiceGateWay + wbResearch + "/deleteResearchQuestionAnswer"; //Post
export const WsSubmitResearchSubjectForApproval =
  webServiceGateWay + wbResearch + "/submitResearchSubjectForApproval"; //Post
export const WsPutResearchConclusion =
  webServiceGateWay + wbResearch + "/putResearchConclusion"; //Post
export const WsGetResearchConclusion =
  webServiceGateWay + wbResearch + "/getResearchConclusion"; //get /{userId}/{subjectId}
export const WsGetResearchTypes =
  webServiceGateWay + wbResearch + "/getResearchTypes"; //Get
export const WsGetResearchSubjectsByUser =
  webServiceGateWay +"dm_research_n"  + "/getResearchSubjectsByUser"; //Get ///getResearchSubjectByUser/{userId}
export const WsGetUserSubjectSubQuestionAndAnswer =
  webServiceGateWay + wbResearch + "/getUserSubjectSubQuestionAndAnswer"; //get /{subjectId}/{userId}/{level}/{parentQuestionId}
export const WsGetOrgResearchSubjects =
  webServiceGateWay + wbResearch + "/getOrgResearchSubjects"; //Get /getOrgResearchSubjects/{orgId}/{userId}
export const WsPutResearchSubjectApproval =
  webServiceGateWay + wbResearch + "/putResearchSubjectApproval"; //Post /putResearchSubjectApproval

export const WsGetUsers = webServiceGateWay + wbResearch + "/getUsers"; //Get /getUsers/{orgId}/{userId}

export const WsAssignQuestionToUser =
  webServiceGateWay + wbResearch + "/assignQuestionToUser"; //Post /assignQuestionToUser

export const WsGetOrgResearchSubjectsAssignedToUser =
  webServiceGateWay + wbResearch + "/getOrgResearchSubjectsAssignedToUser"; //Get /getOrgResearchSubjectsAssignedToUser/{orgId}/{userId}

export const WsGetUserAssignedSubjectQuestionAndAnswer =
  webServiceGateWay + wbResearch + "/getUserAssignedSubjectQuestionAndAnswer"; //Get /getUserAssignedSubjectQuestionAndAnswer/{subjectId}/{userId}/{level}/{parentQuestionId(optional)}

export const WSPutRemarks = webServiceGateWay + wbResearch + "/putRemarks"; //Post /putRemarks

export const WSGetRemarksBySubjectId =
  webServiceGateWay + wbResearch + "/getRemarksBySubjectId"; //Get /getRemarksBySubjectId/{subjectId}/{userId}

export const WsMove2Stage = webServiceGateWay + wbResearch + "/move2Stage"; //Post
export const WsPutResearchDocformdraftWatchlist =
  webServiceGateWay + wbResearch + "/putResearchDocformdraftWatchlist"; //Post
export const WsGetResearchDocformdraftWatchlist =
  webServiceGateWay + wbResearch + "/getResearchDocformdraftWatchlist"; //Get

export const WsGetResearchSubjectPresetDocform =
  webServiceGateWay + wbResearch + "/getResearchSubjectPresetDocform"; //Get

export const WsPutResearchSubjectPresetDocform =
  webServiceGateWay + wbResearch + "/putResearchSubjectPresetDocform"; //Post

export const WsRemoveResearchSubjectPresetDocform =
  webServiceGateWay + wbResearch + "/removeResearchSubjectPresetDocform"; //Post

export const WsAssignResearchDocFormToUser =
  webServiceGateWay + wbResearch + "/assignResearchDocFormToUser"; //Post

export const WsGetResearchDocFormsAssignedToUser =
  webServiceGateWay + wbResearch + "/getResearchDocFormsAssignedToUser"; //Get

//Start: Update WebService related to Research as per Legal module
// const wbResearchLcl=""
// export const WsPutLegalResearchSubject =
//   "http://localhost:8080/dm_research_new/putLegalResearchSubject"; //Post //shashi local
export const WsPutLegalResearchSubject =
  webServiceGateWay + new_wbResearch + "/putLegalResearchSubject"; //Post

// export const WsPutLegalResearchSubject =
//   webServiceGateWay + wbResearch + "/putLegalResearchSubject"; //Post
export const WsGetLegalResearchSubjectPresetDocform =
  webServiceGateWay + wbResearch + "/getLegalResearchSubjectPresetDocform"; //Get

export const WsPutLegalResearchSubjectPresetDocform =
  webServiceGateWay + wbResearch + "/putLegalResearchSubjectPresetDocform"; //Post

export const WsRemoveLegalResearchSubjectPresetDocform =
  webServiceGateWay + wbResearch + "/removeLegalResearchSubjectPresetDocform"; //Post

export const WsAssignLegalResearchDocFormToUser =
  webServiceGateWay + wbResearch + "/assignLegalResearchDocFormToUser"; //Post

export const WsGetLegalResearchDocFormsAssignedToUser =
  webServiceGateWay + wbResearch + "/getLegalResearchDocFormsAssignedToUser"; //Get
//End:

const wsDocForm_SU = "docforms_su";
export const WSReadDocLanguages =
  webServiceGateWay + wsDocForm_SU + "/readDocLanguages"; //JAVA
export const WsGetDocFormTemplateAndInputFields =
  webServiceGateWay + wsDocForm_SU + "/getFormFieldsAndTemplate"; //JAVA POST

// const wsOrganisation="organisation"
// export const WsGetOrgDocFormUsages = webServiceGateWay+wsOrganisation+"/getOrgDocFormUsages" //#301 GET [URL/orgId]
// export const WSGetOrgDocForms = webServiceGateWay+wsOrganisation + "/getOrgDocForms"//#192
// export const WSGetOrgDocFormFilled=webServiceGateWay+wsOrganisation+"/getOrgDocFormFilled" //217 [url/orgFormId/submitted]
// export const WSGetOrgDocFormFilledData=webServiceGateWay+wsOrganisation+"/getOrgDocFormFilledData" //218 [url/recId]

// const wbLeOrg = ""; //Local Testing
// let webServiceGateWayTest=webServiceGateWayLcl;
const wbLeOrg = "dm_leorg"; //Server

const wbLeOrg_new = "dm_leorg_new"; //Server new war file 20-08-2024
const wbLeOrg_new1 = "dm_leorg_new1"; //Server new war file 20-08-2024
const wbLeOrg_NEW2 = "dm_leorg_new2"; //Server new war file 20-08-2024
const wbLeOrg_new2 = "dm_leorg2"; //Server new war file 20-08-2024
// const wbLeOrg_new = "dm_leorg-new"; //Server new war file 20-08-2024
export const WsGetFileUrl =
  webServiceGateWay + wbLeOrg_new + "/viewJudgmentResourceFile";
export const WsFileUpload = webServiceGateWay + wbLeOrg_new + "/uploadFiles";
let webServiceGateWayTest = webServiceGateWay;
export const WsAddClient = webServiceGateWayTest + wbLeOrg + "/addClient"; //Post
// export const WsAddClientNew = "http://localhost:8080/dm_leorg_new/addClientNew"; //Post // local shashi
export const WsAddClientNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/addClientNew"; //Post // live
export const WsGetCaseTypes = webServiceGateWayTest + wbLeOrg + "/getCaseTypes"; //Get
export const WsGetOrgClients =
  webServiceGateWayTest + wbLeOrg + "/getOrgClients"; //Get/{orgId}/{userId}
// export const WsGetOrgClientsNew =
//   "http://localhost:8080/dm_leorg_new/getOrgClientsNew"; //Get/{orgId}/{userId} // shashi local
export const WsGetOrgClientsNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/getOrgClientsNew"; //Get/{orgId}/{userId} // live
export const WsPutClientCase =
  webServiceGateWayTest + wbLeOrg + "/putClientCase"; //Post
// export const WsPutClientCaseNew =
//   "http://localhost:8080/dm_leorg_new/putClientCaseNew"; //Post // shashi local
export const WsPutClientCaseNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/putClientCaseNew"; //Post // live
export const WsGetOrgClientCases =
  webServiceGateWayTest + wbLeOrg + "/getOrgClientCases"; //Get/{orgId}/{userId}/{clientId(optional)}
// export const WsGetOrgClientCasesNew =
//   "http://localhost:8080/dm_leorg_new/getOrgClientCases"; //shashi local
export const WsGetOrgClientCasesNew =
  webServiceGateWayTest + wbLeOrg_new + "/getOrgClientCases"; //Get/{orgId}/{userId}/{clientId(optional)} // live
// export const WsGetOrgClientCasesNew1 = "http://localhost:8080/dm_leorg_new/getOrgClientCasesNew"; // shashi local
// export const WsGetOrgClientCasesNew1 =
//   "http://localhost:8080/dm_leorg_new/getOrgClientCasesNew"; // shashi local
export const WsGetOrgClientCasesNew1 =
  webServiceGateWayTest + wbLeOrg_new1 + "/getOrgClientCasesNew"; // live
export const UpdateCaseStatus =
  webServiceGateWayTest + wbLeOrg_new1 + "/updateCaseStatus"; // live
// export const UpdateCaseStatus =
//   "http://localhost:8080/dm_leorg_new/updateCaseStatus"; // shshi local
export const WsGetLegalGeneralDocForm =
  webServiceGateWayTest + wbLeOrg_new + "/getLegalGeneralDocForm"; //Get/{orgId}/{userId}/{type[string]}
//  export const WsGetLegalGeneralDocForm =
//    webServiceGateWayTest + wbLeOrg + "/getLegalGeneralDocForm"; //Get/{orgId}/{userId}/{type[string]}
export const WsGetClientCaseDocForms =
  webServiceGateWayTest + wbLeOrg + "/getClientCaseDocForms"; //Get/{caseId}/{orgId}/{userId}/{type}
export const WsGetClientCaseDocFormsNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/getClientCaseDocForms"; //Get/{caseId}/{orgId}/{userId}/{type}
export const WsPutClientCaseDocFormMap =
  webServiceGateWayTest + wbLeOrg + "/putClientCaseDocFormMap"; //Post
export const WsPutClientCaseDocFormMapNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/putClientCaseDocFormMap"; //Post
export const WsRemoveClientCaseDocFormMap =
  webServiceGateWayTest + wbLeOrg_new1 + "/removeClientCaseDocFormMap"; //Post
// export const WsRemoveClientCaseDocFormMap =
//   webServiceGateWayTest + wbLeOrg + "/removeClientCaseDocFormMap"; //Post
export const WsPutClientDocFormDraftDataNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/putClientDocFormDraftData"; //Post
// export const WsPutClientDocFormDraftDataNew =
//   webServiceGateWayTest + wbLeOrg_new + "/putClientDocFormDraftData"; //Post
export const WsPutClientDocFormDraftData =
  webServiceGateWayTest + wbLeOrg + "/putClientDocFormDraftData"; //Post
export const WsGetClientCaseResearches =
  webServiceGateWayTest + wbLeOrg + "/getClientCaseResearches"; //Get
export const WsGetClientCaseResearchesNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/getClientCaseResearches"; //Get
export const WsPutClientCaseResearchMap =
  webServiceGateWayTest + wbLeOrg + "/putClientCaseResearchMap"; //Post
export const WsPutClientCaseResearchMapNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/putClientCaseResearchMap"; //Post
export const WsRemoveClientCaseResearchMap =
  webServiceGateWayTest + wbLeOrg_new1 + "/removeClientCaseResearchMap"; //Post
export const WsGetFileMergeTemplates =
  webServiceGateWayTest + wbLeOrg + "/getFileMergeTemplates"; //Get ///{userId}/{status}
export const WsGetFilesForMerge =
  webServiceGateWayTest + wbLeOrg_new2 + "/getFilesForMerge"; //Get /userId/orgId/recordId
export const WsPutFileMergeUserRecord =
  webServiceGateWayTest + wbLeOrg_new2 + "/putFileMergeUserRecord"; //Post
export const WsPutFileForMerge =
  webServiceGateWayTest + wbLeOrg_new2 + "/putFileForMerge"; //Post
// "/getMergeFilesAsPerSequence/{orgId}/{userId}/{recordId}" or "/getMergeFilesAsPerSequence/{orgId}/{userId}/{recordId}/{isIndex}
export const WsMergeFilesAsPerSequence =
  webServiceGateWayTest + wbLeOrg_new + "/mergeFilesAsPerSequence";
export const WsMergeFilesAsPerSequence2 =
  webServiceGateWayTest + wbLeOrg_NEW2 + "/mergeFilesAsPerSequence";
export const WsGetFileMergeOrgRecord =
  webServiceGateWayTest + wbLeOrg_new2 + "/getFileMergeOrgRecord"; //Get /orgId/userId
export const WsRemoveFileForMerge =
  webServiceGateWayTest + wbLeOrg + "/removeFileForMerge"; //Post
export const WsGetClientCaseFilledDocFormsNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/getClientCaseFilledDocForms"; //Get {caseId}/{orgId}/{userId}/(optional){type}
export const WsGetClientCaseFilledDocForms =
  webServiceGateWayTest + wbLeOrg + "/getClientCaseFilledDocForms"; //Get {caseId}/{orgId}/{userId}/(optional){type}
export const WsGetClientCaseFilledDocFormDraft =
  webServiceGateWayTest + wbLeOrg_new1 + "/getClientCaseFilledDocFormDraft"; //Get /{id}/{caseId}/{orgId}/{userId}
// export const WsGetClientCaseFilledDocFormDraft =
//   webServiceGateWayTest + wbLeOrg + "/getClientCaseFilledDocFormDraft"; //Get /{id}/{caseId}/{orgId}/{userId}
export const WsGetClientCaseFilledDocFormDraftNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/getClientCaseFilledDocFormDraft"; //Get /{id}/{caseId}/{orgId}/{userId}

export const WsPutCaseEvent =
  webServiceGateWayTest + wbLeOrg_new1 + "/putCaseEvent"; //Post
// export const WsPutCaseEvent = webServiceGateWayTest + wbLeOrg + "/putCaseEvent"; //Post
export const WsGetCaseEvents =
  webServiceGateWayTest + wbLeOrg + "/getCaseEvents"; //Get /{caseId}/{orgId}/{userId}
export const WsGetCaseEventsNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/getCaseEvents"; //Get /{caseId}/{orgId}/{userId}
export const WsRemoveCaseEvent =
  webServiceGateWayTest + wbLeOrg_new1 + "/removeCaseEvent"; //Post

export const WsPutCaseBill = webServiceGateWayTest + wbLeOrg + "/putCaseBill"; //Post
// export const WsPutCaseBillNew =
//   webServiceGateWayTest + wbLeOrg_new + "/putCaseBill"; //Post
export const WsPutCaseBillNew =
  "https://web1024.ipguide.net:5000/dm_leorg_new/putCaseBill"; //Post
export const WsGetCaseBills = webServiceGateWayTest + wbLeOrg + "/getCaseBills"; //Get /{caseId}/{orgId}/{userId}/{type}(*optional)
// export const WsGetCaseBillsNew =
//   webServiceGateWayTest + wbLeOrg_new + "/getCaseBills";
export const WsGetCaseBillsNew =
  "https://web1024.ipguide.net:5000/getCaseBills";
export const WsGetCaseOrgBills =
  "https://web1024.ipguide.net:5000/caseBills/org-caseBills"; // live
// export const WsGetCaseOrgBills =
//   "http://localhost:4000/caseBills/org-caseBills"; // shashi local
export const WsRemoveCaseBill =
  webServiceGateWayTest + wbLeOrg_new1 + "/removeCaseBill"; //Post
// export const WsRemoveCaseBill =
//   webServiceGateWayTest + wbLeOrg + "/removeCaseBill"; //Post

// export const WsPutCaseDiary = "http://localhost:8080/dm_leorg_new/putCaseDiary"; //Post // shashi local
export const WsPutCaseDiary =
  webServiceGateWayTest + wbLeOrg_new + "/putCaseDiary"; //Post
export const WsPutCaseDiaryNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/putCaseDiary"; //Post
export const updateAdditionalData =
  "https://web1024.ipguide.net:5000/caseDiary/updateAdditionalData";
export const caseDiaryDocument =
  "https://web1024.ipguide.net:5000/caseDiary/document";
export const WsGetCaseDiary =
  webServiceGateWayTest + wbLeOrg_new + "/getCaseDiary"; //Get /{caseId}/{orgId}/{userId}
export const WsGetCaseDiaryNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/getCaseDiary"; //Get /{caseId}/{orgId}/{userId}
export const WsRemoveCaseDiary =
  webServiceGateWayTest + wbLeOrg + "/removeCaseDiary"; //Post
export const WsRemoveCaseDiaryNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/removeCaseDiary"; //Post

export const WsGetLegalResearchDocFormDraft =
  webServiceGateWayTest + wbLeOrg + "/getLegalResearchDocFormDraft"; //Get /{id}/{orgId}/{userId}
export const WsGetLegalResearchFinalDraft =
  webServiceGateWayTest + wbLeOrg + "/getLegalResearchFinalDraft"; //Get /{id}/{orgId}/{userId}
export const WsGetLegalResearchDocFormDraftNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/getLegalResearchDocFormDraft"; //Get /{id}/{orgId}/{userId}
export const WsGetLegalResearchFinalDraftNew =
  webServiceGateWayTest + wbLeOrg_new1 + "/getLegalResearchFinalDraft"; //Get /{id}/{orgId}/{userId}

export const WsGetCaseLaws = webServiceGateWayTest + wbLeOrg + "/getCaseLaws"; //Get
export const WsPutCaseLaw = webServiceGateWayTest + wbLeOrg_new + "/putCaseLaw"; //Post
export const WsPubUnpubCaseLaw =
  webServiceGateWayTest + wbLeOrg + "/pubUnpubCaseLaw"; //Post

export const WsPutCaseLaw2CaseMap =
  webServiceGateWayTest + wbLeOrg + "/putCaseLaw2CaseMap"; //Post

export const WsGetCaseLaw2CaseMap =
  webServiceGateWayTest + wbLeOrg + "/getCaseLaw2CaseMap"; //Get

export const WsGetCaseLaw2CaseMapNew =
  webServiceGateWayTest + wbLeOrg_new + "/getCaseLaw2CaseMap_new"; //Get

export const WsGetOrgUserGroupClientCases =
  webServiceGateWayTest + wbLeOrg + "/getCasesByUserGroup"; //Get

export const WsPutCase2UserGroup =
  webServiceGateWayTest + wbLeOrg + "/putCase2UserGroup"; //Post

const webServiceUserFiles = "userFiles";
const webServiceUserFilesnew = "userFiles_new";
export const WsGetFileMergeTemplate =
  webServiceGateWay + webServiceUserFilesnew + "/getFileMergeTemplate"; //#206 [url/userId/recId]

export const AskGenereativeAI =
  "https://web1024.ipguide.net:4000/api/user/ai_search";
// export const AskGenereativeAI =
//   "https://web1024.ipguide.net:4000/api/supreme_court/ai_search";

const webServiceWebContent = "web_content";

export const WSReadWebContentByCode =
  webServiceGateWay + webServiceWebContent + "/readWebContentByCode";

export const uploadSingleFileExt =
  "https://web1024.ipguide.net:5000/uploadSingle";
export const askGenerateAiProbelmInfo =
  "https://web1024.ipguide.net:5000/askAi";
export const mergeMultipleSNO =
  "https://web1024.ipguide.net:5000/mergeMultipleSNO";
// export const mergeMultipleSNO = "http://localhost:4000/mergeMultipleSNO"; // shashi local url
export const GetRecordsWithDynamicParameters =
  "https://web1024.ipguide.net:4000/api/user/get_records_with_dynamic_parameters";

// WABA URLS

export const scheduleTemplate =
  "https://web1024.ipguide.net:4001/webhook/schedule-template";

// case diary
export const GetAlertMessages =
  "https://web1024.ipguide.net:5000/caseDiary/alert-message";
// export const GetAlertMessages = ""http://localhost:4000/caseDiary/alert-message"";
export const GetOrgCaseDiary =
  "https://web1024.ipguide.net:5000/caseDiary/org-caseDiary";
export const GetOrgCases =
  "https://web1024.ipguide.net:5000/caseDiary/org-cases";
// export const GetOrgCaseDiary = "http://localhost:4000/caseDiary/org-caseDiary";
// export const GetOrgCases = "http://localhost:4000/caseDiary/org-cases";
export const scheduleReport =
  "https://web1024.ipguide.net:5000/caseDiary/schedule-report";
// export const scheduleReport = "http://localhost:4000/caseDiary/schedule-report";

export const MasterOrg =
  "https://web1024.ipguide.net:5000/taskOrg/master-org";
// export const getMasterOrg = "http://localhost:4000/taskOrg/master-org";
export const SchedulerTask =
  "https://web1024.ipguide.net:5000/taskOrg/master-schedular";
export const SchedulerTaskStatus =
  "https://web1024.ipguide.net:5000/taskOrg/master-schedular-status";
// export const GetSchedulerTask =
//   "http://localhost:4000/taskOrg/master-schedular";

//sticky notes

export const GetAllStickyNotesByUserId =
  "https://web1024.ipguide.net:5000/stickyNotes/getStickyNotesByUserId";
export const GetStickyNotesByCaseId =
  "https://web1024.ipguide.net:5000/stickyNotes/getStickyNotesByCaseId";
export const CreateStickyNotes =
  "https://web1024.ipguide.net:5000/stickyNotes/addStickyNotes";
export const GetStickyNotesByResearchSubjectId =
  "https://web1024.ipguide.net:5000/stickyNotes/getNotesByResearchSubject";
export const UpdateStickyNotes =
  "https://web1024.ipguide.net:5000/stickyNotes/updateStickyNotesById";
export const DeleteStickyNotesById =
  "https://web1024.ipguide.net:5000/stickyNotes/deleteStickyNotesById";
export const GetCaseIdByResearchSubjectId =
  "https://web1024.ipguide.net:5000/stickyNotes/getCaseIdByResearchSubjectId";
// export const GetCaseIdByResearchSubjectId =
//   "http://localhost:4000/stickyNotes/getCaseIdByResearchSubjectId"; // shashi local

// for judgement search - jan 22
export const getFieldsURL =
  "https://web1024.ipguide.net:4000/api/admin/getFields";

//for caSE JUDGEMENTS
export const LinkJudgmentWithCase =
  "https://web1024.ipguide.net:5000/caseJudgement/linkJudgmentWithCase";
export const GetOrgCaseJudgments =
  "https://web1024.ipguide.net:5000/caseJudgement/getOrgCaseJudgments";
  export const WSAddPageNumberToMergeFile =
  "https://web1024.ipguide.net:5000/addHeaderFooterToPdf"; //Node
