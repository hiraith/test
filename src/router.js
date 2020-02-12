import Vue from "vue";
import Router from "vue-router";
import MainView from "./components/MainView";
import MainEmployAddress from "./components/address/employees/MainEmployAddress";
import Employees from "./components/address/employees/Employees";
import OutAddressMain from "./components/address/outaddress/OutAddressMain";
import MypageInfo from "./components/mypage/MypageInfo";
import Addposts from "./components/posts/Addposts";
import PostsList from "./components/posts/PostsList";
import Post from "./components/posts/Post";
import WorkingStatus from "./components/working/WorkingStatus.vue";
import AnnualDetail from "./components/working/AnnualDetail.vue";
import FileExplorer from "./components/file/fileExplorer.vue";
import SignWait from "./components/approval/SignWait.vue";
import Approval from "./components/approval/Approval";
import DocWrite from "./components/approval/DocWrite";
import SignWaitDetails from "./components/approval/SignWaitDetails";
import DocTemp from "./components/approval/DocTemp";
import SignIng from "./components/approval/SignIng";
import SignIngDetails from "./components/approval/SignIngDetails";
import DocTempDetails from "./components/approval/DocTempDetails";
import SignComplete from "./components/approval/SignComplete";
import SignCompleteDetails from "./components/approval/SignCompleteDetails";
import SignReject from "./components/approval/SignReject";
import SignRejectDetails from "./components/approval/SignRejectDetails";
import SignHold from "./components/approval/SignHold";
import SignHoldDetails from "./components/approval/SignHoldDetails";
import Reference from "./components/approval/Reference";
import ReferenceDetails from "./components/approval/ReferenceDetails";
import Receive from "./components/approval/Receive";
import ReceiveDetails from "./components/approval/ReceiveDetails";
import AddSurvey from "./components/survey/AddSurvey";
import SurveyList from "./components/survey/SurveyList";
import Survey from "./components/survey/Survey";
import DepPostsList from "./components/posts/DepPostsList";
import EndSurveyList from "./components/survey/EndSurveyList";
import DepBoard from "./components/posts/DepBoard";
import DepPage from "./components/posts/DepPage";
import EndSurvey from "./components/survey/EndSurvey";
import DeleteBoard from "./components/posts/DeleteBoard";
import EmployeesManagement from "./components/managerpage/EmployeesManagement";
import EmployeesMgmDetail from "./components/managerpage/EmployeesMgmDetail";
import AddEmployees from "./components/managerpage/AddEmployees";
import OutManagement from "./components/managerpage/OutManagement";
import AddOutAddress from "./components/managerpage/AddOutAddress";
import OutMgmDetail from "./components/managerpage/OutMgmDetail";
import FormManagement from "./components/managerpage/FormManagement";
import employeesPopup from "./components/managerpage/employeesPopup";
import Calendar from "./components/schedule/Calendar";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "mainView",
            component: MainView,
        },
        /*--addressRouter*/
        {
            path: "/mainEmployAddress",
            name: "main-employAddress",
            component: MainEmployAddress,
            children: [
                {
                    path: "/mainEmployAddress/:emp_id",
                    name: "employees-details",
                    component: Employees,
                    props: true
                },
            ]
        },
        {
            path: "/employees/:emp_id",
            name: "employees",
            component: Employees,
            props: true
        },
        {
            path: "/mainOutAddress",
            name: "outAddress-main",
            component: OutAddressMain
        },

                                                                /*--ManagerRouter*/

        {
            path: "/manager/employees",
            name: "employees-mgm",
            component: EmployeesManagement,
            children:[{
                path: "/manager/form-management",
                name: "employeesPopup",
                component: employeesPopup,
                props: true
            },]

        },
        {
            path: "/manager/employees/:emp_id",
            name: "EmployeesMgmDetail",
            component: EmployeesMgmDetail,
            props: true
        },
        {
            path: "/manager/add-employees",
            name: "AddEmployees",
            component: AddEmployees
        },
        {
            path: "/manager/out-address",
            name: "outManagement",
            component: OutManagement
        },
        {
            path: "/manager/out-address/:out_id",
            name: "OutMgmDetail",
            component: OutMgmDetail,
            props: true
        },
        {
            path: "/manager/add-out-address",
            name: "AddOutAddress",
            component: AddOutAddress
        },
        {
            path: "/manager/form-management",
            name: "formManagement",
            component: FormManagement
        },



       /*---------------------------------------------- */




        {
            path: "/mypage",
            name: "mypage",
            component: MypageInfo
        },
        {
            path: "/pst/add",
            name: "add",
            component: Addposts
        },
        {
            path:  "/pst/posts",
            name: "post",
            alias: "/pst",
            component: PostsList
        },
        {
            path: "/pst/PostsList/:post_id",
            name: "post-details",
            component: Post,
            props : true
        },
        {
            path: "/working/status",
            name: "workingStatus",
            alias: "/working",
            component: WorkingStatus
        },
        {
            path: "/working/annual",
            name: "annualDetail",
            component: AnnualDetail
        },
        {
            path: "/schedule/calendar",
            name: "calendar",
            alias: "/calendar",
            component: Calendar
        },
        {
            path:"/survey/addsurvey",
            name:"addsurvey",
            alias: "/addsurvey",
            component: AddSurvey
        },
        {
            path:  "/survey/allsurvey",
            name: "SurveyList",
            alias: "/survey",
            component: SurveyList
        },
        {
            path:  "/survey/endsurvey",
            name: "EndSurveyList",
            alias: "/endsurvey",
            component: EndSurveyList
        },
        {
            path: "/survey/SurveyList/:survey_id",
            name: "survey-details",
            component: Survey,
            props : true
        },
        {
            path: "/survey/EndSurveyList/:survey_id",
            name: "end-survey-details",
            component: EndSurvey,
            props : true
        },
        {
            path: "/dep_pst/add",
            name: "dep_add",
            component: Addposts
        },
        {
            path:  "/dep_pst/posts",
            name: "dep_post",
            alias: "/dep_pst",
            component: DepPostsList
        },
        {
            path: "/dep_pst/PostsList/:post_id",
            name: "dep_post-details",
            component: Post,
            props : true
        },
        {
            path:"/dep_pst/newBoard",
            name:"board",
            component: DepBoard
        },
        {
            path:"/dep_pst/DepPage/:board_name",
            name: "DepPage",
            component:DepPage,

        },
        {
            path:"/dep_pst/DeleteBoard/",
            name: "Delete-Board",
            component:DeleteBoard,
        },


        {
            path: "/app",
            name: "approval",
            component: Approval
        },
        {
            path: "/app/doc/write",
            name: "write",
            alias: "/app/doc",
            component: DocWrite

        },
        {
            path: "/app/doc/temp",
            name: "temp",
            component: DocTemp
        },
        {
            path: "/app/doc/temp/:id",
            name: "DocTempDetails",
            component: DocTempDetails,
            props: true
        },

        {
            path: "/app/sign/wait",
            name: "wait",
            alias: "/app/sign",
            component: SignWait
        },
        {
            path: "/app/sign/wait/:id",
            name: "wait-details",
            component: SignWaitDetails,
            props: true
        },

        {
            path: "/app/sign/ing",
            name: "ing",
            component: SignIng
        },
        {
            path: "/app/sign/ing/:id",
            name: "ing-details",
            component: SignIngDetails,
            props: true
        },

        {
            path: "/app/sign/complete",
            name: "complete",
            component: SignComplete
        },
        {
            path: "/app/sign/ing/:id",
            name: "complete-details",
            component: SignCompleteDetails,
            props: true
        },

        {
            path: "/app/sign/reject",
            name: "reject",
            component: SignReject
        },
        {
            path: "/app/sign/reject/:id",
            name: "reject-details",
            component: SignRejectDetails,
            props: true
        },

        {
            path: "/app/sign/hold",
            name: "hold",
            component: SignHold
        },
        {
            path: "/app/sign/hold/:id",
            name: "hold-details",
            component: SignHoldDetails,
            props: true
        },

        {
            path: "/app/ref/ref",
            name: "ref",
            alias:"/app/ref",
            component: Reference
        },
        {
            path: "/app/ref/:id",
            name: "ref-details",
            component: ReferenceDetails,
            props: true
        },

        {
            path: "/app/rcv/rcv",
            name: "rcv",
            alias:"/app/rcv",
            component: Receive
        },
        {
            path: "/app/rcv/:id",
            name: "rcv-details",
            component: ReceiveDetails,
            props: true
        },
        {
            path: "/file/All",
            name: "file",
            alias: ["/file","/file/dep","/file/emp"],
            component: FileExplorer
        }
    ]
});