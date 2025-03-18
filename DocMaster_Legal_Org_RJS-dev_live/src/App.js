import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "react-tooltip/dist/react-tooltip.css";
import "./App.css";
import "./Theme.css";
import "./stylesheets/InputField.css";
import "./stylesheets/Custom.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Casepreparation from "./pages/casepreparation";
import Casepreparation1 from "./pages/casepreparation1";
import Casepreparations from "./pages/casepreparations";
import Documentmanagmenet from "./pages/document_managment";
import ClientCaseInfo from "./pages/clientcaseinfo";
import JudgementCourtFee from "./pages/judgmentcourtfee";
import Judgmentcourtfees from "./pages/judgmentcourtfees";
import Research from "./pages/researchs/Research";
import Documentmanagments from "./pages/DocManagements";
import Clientcaseinformation from "./pages/clientcaseinformation";
import WebPage from "./pages/WebPage";
import QRcode from "./pages/qrcode";
import ForgetPasswordForm from "./pages/ForgetPasswordForm";
import ResetPassword from "./pages/ResetPassword";
import Ipr_copyright_page from "./pages/ipr_copyright_page";
import Doc_master_leagal_in from "./pages/docMaster-leagal-in";
import PrivacyPolicy from "./pages/privacyPolicy";
import MasterScheduleCalendar from "./components/masterScheduler/masterScheduler";

const Home = lazy(() => import("./pages/Home"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Payment = lazy(() => import("./pages/paymentMethod"));
const Invoices = lazy(() => import("./pages/Invoice"));
const Receipt = lazy(() => import("./pages/Receipt"));
const Profile = lazy(() => import("./pages/Profile"));
const Terms_and_Conditions = lazy(() => import("./pages/Terms_and_Conditions"));
// const ipr_copyright_page = lazy(() => import("./pages/ipr_copyright_page"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Cancellation_Policy = lazy(() => import("./pages/Cancellation_Policy"));

const LogIn = lazy(() => import("./pages/LogIn"));
const Verifyotp = lazy(() => import("./pages/Verifyotp"));
const Mobileotp = lazy(() => import("./pages/mobileotp"));
const MobileVerifyotp = lazy(() => import("./pages/mobileVerifyotp"));
const VerifyEmailotp = lazy(() => import("./pages/VerifyEmailotp"));
const SignUp = lazy(() => import("./pages/signup/SignUp"));
const DecTermCond = lazy(() => import("./pages/DecTermCond"));

const DocFormAdd = lazy(() => import("./pages/docForm/Add"));
const DocFormEdit = lazy(() => import("./pages/docForm/Edit"));

const DocFormShowAll = lazy(() => import("./pages/docForm/ShowAll"));
const DocFormUserFilledData = lazy(() =>
  import("./pages/docForm/UserFilledData")
);
const DocFormViewUserFilled = lazy(() =>
  import("./pages/docForm/UserFilledDataView")
);

const DocFormUserAccess = lazy(() => import("./pages/docForm/UserAccess"));

const DocFormView = lazy(() => import("./pages/docForm/View"));
const DocFormPutTemplateAndFields = lazy(() =>
  import("./pages/docForm/PutTemplateAndFields")
);
const DocFormTestRun = lazy(() => import("./pages/docForm/TestRun"));

const UserAdd = lazy(() => import("./pages/user/Add"));
const UserShowAll = lazy(() => import("./pages/user/ShowAll"));
const CaseDiaryCalendar = lazy(() =>
  import("./pages/caseDiary/caseDiaryCalendar")
);
const CaseDiaryCalendar1 = lazy(() =>
  import("./pages/caseDiary1/caseDiaryCalendar")
);
const UserView = lazy(() => import("./pages/user/View"));
const UserImport = lazy(() => import("./pages/user/Import"));

const UserGroupAdd = lazy(() => import("./pages/userGroup/Add"));
const UserGroupShowAll = lazy(() => import("./pages/userGroup/ShowAll"));
const UserGroupView = lazy(() => import("./pages/userGroup/View"));
const UserGroupAddUser = lazy(() => import("./pages/userGroup/AddUser"));

const MyDocFormSearchAndFill = lazy(() =>
  import("./pages/myDocForm/SearchAndFill")
);
const OrgDocFormFill = lazy(() => import("./pages/myDocForm/Fill"));
const MyDocFormDrafts = lazy(() => import("./pages/myDocForm/Drafts"));
const MyDocFormRecords = lazy(() => import("./pages/myDocForm/Records"));

const MyDocFormView = lazy(() => import("./pages/myDocForm/View"));
const MyDocFormViewFilled = lazy(() => import("./pages/myDocForm/ViewFilled"));

const DocFormCategoryAdd = lazy(() => import("./pages/docFormCat/Add"));
const DocFormCategoryEdit = lazy(() => import("./pages/docFormCat/Edit"));
const DocFormCategoryShowAll = lazy(() => import("./pages/docFormCat/ShowAll"));

const DocFormPreFillAdd = lazy(() => import("./pages/docFormPreFill/Add"));

const DocFormPreFillShowAll = lazy(() =>
  import("./pages/docFormPreFill/ShowAll")
);

const DocFormOrgPreFills = lazy(() =>
  import("./pages/docFormPreFill/OrgPreFillFields")
);
const DocFormOrgUserPreFills = lazy(() =>
  import("./pages/docFormPreFill/OrgUserPreFillFields")
);

const DocFormOrgAllUserPreFill = lazy(() =>
  import("./pages/docFormPreFill/OrgAllUserPreFillFields")
);

const DocFormUsageStats = lazy(() => import("./pages/stats/DocFormUsage"));
const DocFormUsageData = lazy(() => import("./pages/stats/DocFormUsageData"));

const ShowAllDepartment = lazy(() => import("./pages/department/ShowAll"));
const MyDepartments = lazy(() => import("./pages/department/My"));
const MyDepDocForms2Fill = lazy(() =>
  import("./pages/department/SearchAndFill")
);

const DepDocForms = lazy(() => import("./pages/department/DocForms"));
const DepUsers = lazy(() => import("./pages/department/Users"));

const ResearchSubjects = lazy(() =>
  import("./pages/researchs/ResearchSubjects")
);
const MyResearchSubject = lazy(() =>
  import("./pages/researchs/MyResearchSubject")
);
const MyResearchSubjects = lazy(() =>
  import("./pages/researchs/MyResearchSubjects")
);
const CreateResearchSubject = lazy(() =>
  import("./pages/researchs/CreateResearchSubject")
);

const OrgResearchs = lazy(() => import("./pages/researchs/OrgResearchs"));
const OrgResearch = lazy(() => import("./pages/researchs/OrgResearch"));
const OrgResearchEdit = lazy(() => import("./pages/researchs/OrgResearchEdit"));
const OrgResearchView = lazy(() => import("./pages/researchs/OrgResearchView"));
// const Research = lazy(() => import("./pages/researchs/Research"));

const ResearchsAssign2Me = lazy(() =>
  import("./pages/researchs/ResearchsAssign2Me")
);
const ResearchAssigned = lazy(() =>
  import("./pages/researchs/ResearchAssigned")
);

const Clients = lazy(() => import("./pages/client/Clients"));
const ClientCreate = lazy(() => import("./pages/client/Create"));
const ClientShowAll = lazy(() => import("./pages/client/ShowAll"));

const ClientCaseCreate = lazy(() => import("./pages/clientCase/Create"));
const ClientCaseShowAll = lazy(() => import("./pages/clientCase/ShowAll"));
const ShowAllByUserGroup = lazy(() =>
  import("./pages/clientCase/ShowAllByUserGroup")
);
// const ClientCaseShow = lazy(() => import("./pages/clientCase/subMenuCase"));
const ClientCaseShow = lazy(() => import("./pages/clientCase/Show"));
const ClientCaseShowAllByClient = lazy(() =>
  import("./pages/clientCase/ShowAllByClient")
);

const SubMenuOnlineRecords = lazy(() => import("./pages/subMenuOnlineRecords"));
const ClientCaseInfoDocForms = lazy(() =>
  import("./pages/legalOrg/ClientCaseInfoDocForms")
);
const ClientCaseInfoDocFormFill = lazy(() =>
  import("./pages/legalOrg/ClientCaseInfoDocFormFill")
);

const FeeCalculator = lazy(() => import("./pages/legalOrg/FeeCalculator"));

const MergeTemplates = lazy(() => import("./pages/fileMerge/MergeTemplates"));

const MergeProcess = lazy(() => import("./pages/fileMerge/MergeProcess"));

const MergeRecords = lazy(() => import("./pages/fileMerge/MergeRecords"));

const CaseLaws = lazy(() => import("./pages/caseLaw/ShowAll"));
const CaseLawCreate = lazy(() => import("./pages/caseLaw/Create"));

// const Casepreparation = lazy(() => import("./pages/Casepreparation"));

function App() {
  if (process.env.NODE_ENV === "production") {
    //DevNote(By Pramod): DO not Produce Logs Out put on Console in production
    console.log = function () {};
  }

  if (process.env.NODE_ENV === "development") {
    //DevNote(By Pramod): DO not Produce Logs Out put on Console in production
    //console.log = function() {};
  }
  //Testing
  // console.log("Afterprocess.env.NODE_ENV", process.env.NODE_ENV);

  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <Router>
          <Routes>
            <Route exact path="/Home" element={<Home />} />
            <Route exact path="/Pricing" element={<Pricing />} />
            <Route exact path="/Payment" element={<Payment />} />
            <Route
              exact
              path="/Doc_master_leagal_in"
              element={<Doc_master_leagal_in />}
            />
            <Route
              exact
              path="/SubMenuOnline"
              element={<SubMenuOnlineRecords />}
            />
            <Route exact path="/Invoice" element={<Invoices />} />
            <Route exact path="/Receipt" element={<Receipt />} />
            <Route exact path="/Profile" element={<Profile />} />
            <Route
              exact
              path="/Terms_and_Conditions"
              element={<Terms_and_Conditions />}
            />
            <Route
              exact
              path="/ipr_copyrights"
              element={<Ipr_copyright_page />}
            />
            <Route
              exact
              path="/doc_master_leagal_in"
              element={<Doc_master_leagal_in />}
            />
            <Route exact path="/Disclaimer" element={<Disclaimer />} />
            <Route
              exact
              path="/Cancellation_Policy"
              element={<Cancellation_Policy />}
            />
            <Route
              exact
              path="/Privacy_Policy"
              // element={<Cancellation_Policy />}
              element={<PrivacyPolicy />}
            />
            <Route exact path="/login" element={<LogIn />} />
            <Route exact path="/Verifyotp" element={<Verifyotp />} />
            <Route exact path="/Mobileotp" element={<Mobileotp />} />
            <Route
              exact
              path="/forgotPassword"
              element={<ForgetPasswordForm />}
            />
            <Route exact path="/resetPassword" element={<ResetPassword />} />
            <Route
              exact
              path="/MobileVerifyotp"
              element={<MobileVerifyotp />}
            />
            <Route exact path="/VerifyEmailotp" element={<VerifyEmailotp />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/decTermCond" element={<DecTermCond />} />
            <Route exact path="/docFormAdd" element={<DocFormAdd />} />
            <Route exact path="/docFormEdit" element={<DocFormEdit />} />
            <Route exact path="/docFormShowAll" element={<DocFormShowAll />} />
            <Route
              exact
              path="/docFormUserFilledData"
              element={<DocFormUserFilledData />}
            />
            <Route
              exact
              path="/docFormViewUserFilled"
              element={<DocFormViewUserFilled />}
            />
            <Route
              exact
              path="/docFormUserAccess"
              element={<DocFormUserAccess />}
            />

            <Route
              exact
              path="/docFormCategoryAdd"
              element={<DocFormCategoryAdd />}
            />
            <Route
              exact
              path="/docFormCategoryEdit"
              element={<DocFormCategoryEdit />}
            />
            <Route
              exact
              path="/docFormCategoryShowAll"
              element={<DocFormCategoryShowAll />}
            />

            <Route exact path="/docFormView" element={<DocFormView />} />
            <Route
              exact
              path="/docFormPutTemplateAndFields"
              element={<DocFormPutTemplateAndFields />}
            />
            <Route exact path="/docFormTestRun" element={<DocFormTestRun />} />

            <Route exact path="/userAdd" element={<UserAdd />} />
            <Route exact path="/userShowAll" element={<UserShowAll />} />
            <Route exact path="/userView" element={<UserView />} />
            <Route exact path="/userImport" element={<UserImport />} />

            <Route exact path="/caseDiary" element={<CaseDiaryCalendar />} />
            {/* <Route exact path="/caseDiary1" element={<CaseDiaryCalendar1 />} /> */}
            <Route
              exact
              path="/masterScheduler"
              element={<MasterScheduleCalendar />}
            />

            <Route exact path="/userGroupAdd" element={<UserGroupAdd />} />
            <Route
              exact
              path="/userGroupShowAll"
              element={<UserGroupShowAll />}
            />
            <Route exact path="/userGroupView" element={<UserGroupView />} />
            <Route
              exact
              path="/userGroupAddUser"
              element={<UserGroupAddUser />}
            />

            <Route
              exact
              path="/myDocFormSearchAndFill"
              element={<MyDocFormSearchAndFill />}
            />

            <Route exact path="/orgDocFormFill" element={<OrgDocFormFill />} />
            <Route
              exact
              path="/myDocFormDrafts/:isDraft"
              element={<MyDocFormDrafts />}
            />
            <Route
              exact
              path="/myDocFormRecords"
              element={<MyDocFormRecords />}
            />

            <Route exact path="/myDocFormView" element={<MyDocFormView />} />

            <Route
              exact
              path="/myDocFormViewFilled"
              element={<MyDocFormViewFilled />}
            />

            {/* <Route path="/to/page/:pathParam?" component={MyPage} /> */}
            {/* <Route path='/page/:friendlyName/:sort?' element={<Page/>} /> */}

            <Route path="/docFormPreFillAdd" element={<DocFormPreFillAdd />} />
            <Route
              path="/docFormPreFillShowAll"
              element={<DocFormPreFillShowAll />}
            />

            <Route
              path="/docFormOrgPreFills"
              element={<DocFormOrgPreFills />}
            />

            <Route
              path="/docFormOrgUserPreFills"
              element={<DocFormOrgUserPreFills />}
            />

            <Route
              path="/docFormOrgAllUserPreFill"
              element={<DocFormOrgAllUserPreFill />}
            />

            <Route path="/docFormUsageStats" element={<DocFormUsageStats />} />
            <Route path="/docFormUsageData" element={<DocFormUsageData />} />

            <Route path="/showAllDepartment" element={<ShowAllDepartment />} />
            <Route path="/myDepartments" element={<MyDepartments />} />
            <Route
              path="/myDepDocForms2Fill"
              element={<MyDepDocForms2Fill />}
            />

            <Route path="/depDocForms" element={<DepDocForms />} />
            <Route path="/depUsers" element={<DepUsers />} />

            {/*Start:  Research Module */}
            <Route
              exact
              path="/researchSubjects"
              element={<ResearchSubjects />}
            />

            <Route
              exact
              path="/myResearchSubjects"
              element={<MyResearchSubjects />}
            />

            <Route
              exact
              path="/myResearchSubject"
              element={<MyResearchSubject />}
            />
            <Route
              exact
              path="/createResearchSubject"
              element={<CreateResearchSubject />}
            />

            <Route exact path="/orgResearchs" element={<OrgResearchs />} />

            <Route exact path="/orgResearch" element={<OrgResearch />} />
            <Route
              exact
              path="/orgResearchEdit"
              element={<OrgResearchEdit />}
            />
            <Route
              exact
              path="/orgResearchView"
              element={<OrgResearchView />}
            />
            <Route exact path="/research" element={<Research />} />

            <Route
              exact
              path="/researchsAssign2Me"
              element={<ResearchsAssign2Me />}
            />
            <Route
              exact
              path="/researchAssigned"
              element={<ResearchAssigned />}
            />
            {/*End:  Research Module */}

            <Route
              exact
              path="/clientCaseInfoDocForms"
              element={<ClientCaseInfoDocForms />}
            />
            <Route
              exact
              path="/clientCaseInfoDocFormFill"
              element={<ClientCaseInfoDocFormFill />}
            />

            <Route exact path="/feeCal" element={<FeeCalculator />} />
            <Route exact path="/mergeTemplates" element={<MergeTemplates />} />
            <Route exact path="/mergeProcess" element={<MergeProcess />} />
            <Route exact path="/mergeRecords" element={<MergeRecords />} />

            <Route exact path="/clients" element={<Clients />} />
            <Route exact path="/clientCreate" element={<ClientCreate />} />
            <Route exact path="/clientShowAll" element={<ClientShowAll />} />
            <Route
              exact
              path="/clientCaseCreate"
              element={<ClientCaseCreate />}
            />
            <Route
              exact
              path="/clientCaseShowAll"
              element={<ClientCaseShowAll />}
            />

            <Route
              exact
              path="/clientCaseByUserGroup"
              element={<ShowAllByUserGroup />}
            />

            <Route exact path="/clientCaseShow" element={<ClientCaseShow />} />
            <Route
              exact
              path="/clientCaseShowAllByClient"
              element={<ClientCaseShowAllByClient />}
            />

            <Route exact path="/caseLaws" element={<CaseLaws />} />

            <Route exact path="/caseLawCreate" element={<CaseLawCreate />} />
            <Route exact path="/" element={<Casepreparation />} />
            <Route
              exact
              path="/casepreparation1"
              element={<Casepreparation1 />}
            />
            <Route
              exact
              path="/casepreparations"
              element={<Casepreparations />}
            />
            <Route
              exact
              path="/documentmanagment"
              element={<Documentmanagmenet />}
            />
            <Route exact path="/clientCaseInfo" element={<ClientCaseInfo />} />
            <Route
              exact
              path="/judgementCourtFee"
              element={<JudgementCourtFee />}
            />
            <Route
              exact
              path="/judgmentcourtfees"
              element={<Judgmentcourtfees />}
            />
            <Route
              exact
              path="/documentmanagments"
              element={<Documentmanagments />}
            />
            <Route
              exact
              path="/clientcaseinformation"
              element={<Clientcaseinformation />}
            />
            <Route exact path="/webpage" element={<WebPage />} />
            <Route exact path="/QRcode" element={<QRcode />} />
          </Routes>
        </Router>
      </Suspense>
      {/* <ToastContainer autoClose={500} /> */}
    </>
  );
}

export default App;
