(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["exports", "echarts"], factory);
    } else if (
        typeof exports === "object" &&
        typeof exports.nodeName !== "string"
    ) {
        // CommonJS
        factory(exports, require("echarts"));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
})(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== "undefined") {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log("ECharts is not Loaded");
        return;
    }
    if (!echarts.registerMap) {
        log("ECharts Map is not loaded");
        return;
    }
    echarts.registerMap("天津", {
        type: "FeatureCollection",
        features: [
            {
                id: "120101",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@F@DMFIJGQG@COEQM@@OASBBhB`R@DA@CD@DCFCHBLD",
                    ],
                    encodeOffsets: [[120023, 40073]],
                },
                properties: {
                    cp: [117.195907, 39.118327],
                    name: "和平区",
                    childNum: 1,
                },
            },
            {
                id: "120102",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@XFFIE@BGGA@KVBN_]CCCLgMGE@CD@AGB@AEGMEACB@BA@BFWFACKA@DA@@DA@C@CCCDGIAKMBWLGFERWT]bADCNE@DDIDEFBHTHBD@DLMPJj@ARX@",
                    ],
                    encodeOffsets: [[120075, 40099]],
                },
                properties: {
                    cp: [117.226568, 39.122125],
                    name: "河东区",
                    childNum: 1,
                },
            },
            {
                id: "120103",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@PSXSFQHEXKE@CMIFUQA@DC@CCA@CDE@CEE@FOc@@D{@ch]IIHAFE`AZTAPB@@RNPF@DPF",
                    ],
                    encodeOffsets: [[120036, 40057]],
                },
                properties: {
                    cp: [117.217536, 39.101897],
                    name: "河西区",
                    childNum: 1,
                },
            },
            {
                id: "120104",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@@CAUC@@DCBQ@A_AqBOFaDEHEcKG@ED]ZY`ELEdkhHDRNCB@FD@BAFDDHD@JIDANFDECCZCBA\\B@Hd@JB",
                    ],
                    encodeOffsets: [[120008, 40087]],
                },
                properties: {
                    cp: [117.164143, 39.120474],
                    name: "南开区",
                    childNum: 1,
                },
            },
            {
                id: "120105",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@FBBAJBFDJK\\NFEFBLKBBBATP`]QOLB@AHBBEJ@DDDE@QW@BQi@OIKN@CACQECG@CFCJCCCMCGAEDCFBT@DSTQN@BFDBDCJBJAHKAIFDDXDAB",
                    ],
                    encodeOffsets: [[119993, 40130]],
                },
                properties: {
                    cp: [117.201569, 39.156632],
                    name: "河北区",
                    childNum: 1,
                },
            },
            {
                id: "120106",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@JELBBGAIDIACEC@ARMTSKAc@@G[AABYDDDCFMECBIJC@CPHZ@LHNDDPJBCDAZBFEJE",
                    ],
                    encodeOffsets: [[119980, 40125]],
                },
                properties: {
                    cp: [117.163301, 39.175066],
                    name: "红桥区",
                    childNum: 1,
                },
            },
            {
                id: "120110",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@JCFE@CEG@GTCPHBF`@JFBCHJJKRCP@JGTIAQGIDAPAVH@GCEKEEBAAVEBDADPFBBCFBBHE@WHClQPCFBTARECK@QOCEAEK@KAAKAKEoRECIYK{\\Af@BMb@@WAGBC@GV@KYBUkB@@OD@AEUE@IQDAGSJEDFD@CIDAAKDE@KECOKGEE@MXMRCBGAOEMBGFADDN@FCHCBGAIGUKUEcB]JULINIZGD[AU@QDMDGFQR_NODiBcDBLHJDCDDF@@CB@@CLBBDXEAEB@@ADAFBHNBFA@BHC@@DHFNKhDD^DM`UA@LHBAHF@EJWE@RCFCCI@AFGA@BKARP_^ZXZL\\JfHNHEdEAAFBBQCAFPHRGtMBEB@NB^Cb@lECFNFJB@D",
                    ],
                    encodeOffsets: [[120221, 40183]],
                },
                properties: {
                    cp: [117.313967, 39.087764],
                    name: "东丽区",
                    childNum: 1,
                },
            },
            {
                id: "120111",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@CGECABC@@EDAQMGClgD]DM^c^YHCF@VrwJBBINBHAFAHBFCXFDGCCA@AC@AACBAAEFKA@KDCCJCJDFGF@DCBGDQJERFHGMCLEAAGAFGMMAWE@BHQLKIBAJECCCAAGQW[DAAjS@AIYXKGGT@NBFEBABOJBDMFADGG@BGH@@AACFKGCG@FMWMDABCBAACLCIGCAE@[P¥\\]N¯MNORU^]XKF`_XIIAIkDDZF@@FMDJLmTSDaHgDBJE@@DOBDH[HFJCBCGCBIMKH[L@AAAADUBACECGHWKCHTHBHaJDLF@JNF@FNLAH\\FABPD@EF@@HELCHVF@GXBB@DJBI\\PB@BN@BHK@GBAJ\\F@AACLABBAB@DFHB@FFJCDL@BA@@DF@JEBKHB@CjHBENDH@HSFBDKEAFG\\H@DE@AF@HHBANH@BQ@CBGNFT@`LFABIN@ALDBCFRHFB`D`ANANCG[DK",
                    ],
                    encodeOffsets: [[119940, 40092]],
                },
                properties: {
                    cp: [117.012247, 39.139446],
                    name: "西青区",
                    childNum: 1,
                },
            },
            {
                id: "120112",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@ZAZEVKXSPGVEnDHCJYJMVKNEPCdAZHRJJHHBDADG@ECMBCDCLCF@THHANQPWD@DBXRJ@HAJERSJAJBDCEOCAKYBQCA@GBCDSGAGBIHSNA@KCQMCF]INaCuOSGU{zm_yENH@HDELBD@BG@AHH@CHEBCNIAAPABEFMAS@HHWLJZ@BiTBB\\CRXBHDBDDIFABLJRKAGF@BXNNEHHBBBKFNDGHQEIFCRAHCDE@EHICIDDDLCB@ELBFABBD@BBDB@DDCHWEEDGAEBGBMAAJIAMP|@@Cd@EPF@DFF@DCB@DDD@@CRBEVNJ",
                    ],
                    encodeOffsets: [[120108, 40016]],
                },
                properties: {
                    cp: [117.382549, 38.989577],
                    name: "津南区",
                    childNum: 1,
                },
            },
            {
                id: "120113",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@[MILECKA@BA@CABAWCCCIFEFYACBADICIIGM@KMDgDO@UCWIDECABKM@AJEB_KS@MEAH@DARG@BMGA@GBEF@@C[GEHFBCLEAGTG@MCAFgGA@@DGAALIFE@@CB@@ACKIDIGQJ@DHD@@GAANDPbB@BDEJ@BBAFBNBHDBCDBDHBEJFBBDCFANA@AFTFFARPBNLABARA@DD@BB@HFA@PXBBLDACRKEAJF@GPD@AN@BjHCGZFJUN@BA^F@FIAAFNDCF@B\\LONADtJTAFBDCPBDGPETBADNDFFDFCD@LHBBKJFALIA@DB@@BNFBGHBBEN@@DHD@FFBDAH@AHBBCLDBF@@HFBBGJ@BBAFfLLABCH@ADLFJENAHKLAFBDEH@AHBDJB@DD@AADEFCLBNCDMDER@BKGA@ADEZDBELHPQFFJICABACCDAKGJGLHRMVMMERKHH`WBFFCRFJHHIBOK_MC@QLCDIBAMA@COCGCDEkFa@]DMAA@AFsNQHOGBERDAABEFBFcMGeG[IQGGCmgABAAKLEAEF",
                    ],
                    encodeOffsets: [[120024, 40134]],
                },
                properties: {
                    cp: [117.13482, 39.225555],
                    name: "北辰区",
                    childNum: 1,
                },
            },
            {
                id: "120114",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@FFABBRCHBFEDDNAHA@@`@@CHG@AT`D@AH@@PBBCJDBFABGB@@BBAB@BIFBBDJ@@FE@DHKD@JA@@FGCA@ADE@AZFDM\\JBCZCRKA@FGA@JHB@FBBXFBCFB@BB@CRJ@DJ@HCTF@ADB@AHEAIFKACH@CA@CLA@FBAFB@@DH@CFE@ADIEKA@FAABIB@BCG@@CC@BAOMCJGG[C@BABG\\AAAD@FL@@DJBADHB@BA@ABOCCDC@@BC@ADB@ADA@AFL@@A\\D@FFBBEB@CLB@ELB@@BAB@DBB@DEA@DD@AFCACDBHJDALF@AFFBBCPB@DB@ABBBBBD@@DDBFB@DHBCHDBLEJNMF@DKCIFCFQCBAA@@AEBAA@@EA@DOICDGD@BB@ALDA@BYLKA@BBGGA@AMHEABCC@GNLE@NC@@DAAAFEAAJKBBBF@CB@BF@AFH@@BN@ADZF@DD@@DF@DCFBEBF@@JB@EDCPA@@FI@@BF@@DDCCTH@C@TD@BB@G^FAGPECBGG@@BQAGDALG@AJA@AHC@ABC@@FEAAHB@@DB@BDF@AHHFA@DBABD@D@CBBBCBXH@DB@AFH@EHCACFCBCFA@CFDACL@BB@AFB@BCDBBA@BBBBCFBADE@B@@BCBBBD@ABE@ABAA@BLD@BHDBEGA@AD@CABEL@CJHBEHDBEJBBPDFCBEJDDBH@@FADHBMNIHFDEFFD@AJFADBBBAF@D@AHDBRDBD@RCBBJV@@BD@BDPBFEBBCDTHL@DAHBBCDBABTDCJJBGJNBAND@ADFBHE@DED@H@@@F`@BCBBBCB@DFZ@DMA@CFA@GMCADGAGBCNMAAIA@KXGCODOJMD@LJJC@C@KC@BCFAFDRDBAD@CD^F@DF@BFFA@FJB@DbEPEbElMTIZGAAFA@CJ@BE@@@FHA@EJA@CHBADBGPA@BG@AFBBVGHFL@BBABD@DKEC^QZS^QwVMAAB@CCI@@CB@H@JCBCFEDBCFF@D@H@FALIXMBIECM@ADE@OABEPA@CBCD@HEDIGEC@AC@KJ@DCH@@DFADEDAFBFALGBMFABKGAAA@CAALEJOFAFIFEB@JKDEJBDCICFI@IFOBCNECABGBQBCFCAAMKIHED@EKG@JDFOH@EIEDEFOC@BCEACAACAEI@AAHUXC@GD@AMDED@BEF@BBHAKADID@BGCIBEEEKGAFYCCF@BHBALQ@CFCNMDKAEDCFBBA@A@@CIAACBGG@CFEAKBGLMBIFKEBCG@ADKBeKBEAAI@AHEA@GE@CADKAABGG@CBEA@EGC@CM@AFGAAHME@AA@@CJBBKIEALGA@KDCCEEEMCBCSAOFCHOACDEASBsIBCPM[K@ADEMCBEJB@E]EABM@IVYEDHiIBMC@HOE@BILFDQCBAKWA@OEB@GAAC@@CQBABKBAMQOEBSEBEB@BMDEACEAFIGAACDCCAAGAMBEAAI@CF@AaACO@EBGHB@@GC@CRICE@CBAAAKBBD@B[EBIHAL@AGM@@AOAJ[IA@CAAHWM@AHJ@G^G@AF@DA@@FEBBFcJqAEDEC",
                    ],
                    encodeOffsets: [[119669, 40094]],
                },
                properties: {
                    cp: [117.057959, 39.376925],
                    name: "武清区",
                    childNum: 1,
                },
            },
            {
                id: "120115",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@DAD@JCFDJGHBRMCCBGHBBCFBDCFB@EFGD@@BF@@DPALEDCECDEDABED@HCHJH@FDDEFDHENCLBDDDA@ERABEN@JEDDBACEJ@AINMRBJGAIDCZEHCNAFRTJHAHJHFD@@AEKBAFBRJGF@BPAFBHEDBFHBAFO@@NFH@BEFGHAD@BFBBJID@BFDBDEB@J@AGDCL@FBNIBBFJD@HKDCNDF@DAFGFCdE@A@AICBCJC@C@AGAEFC@@MIBAABC@CKA@CBANACAGC@ARBJG@GLGHCX@LENBNE@EDAFBHHD@DCDIIMLCBGN@@AIEBANEGKLEJDDAAGIKHKCIBECIECSF@GBKGCIDC@FKAAGCBOC@OB@MKGC@CHCAAEFUB@HDLPJDBCAIFGDAPDJGBC@EIKDGFAPDNHFF@LBBL@JARQZIDCBCAEIGK@IDEFGE@EHIFAFAP@FAFEBECCOFCBGABCKCBSEEK@ADIGO@AEMCEBBDqNAA@CHYMKiIAW@@CA@GA@DIMA@CGAAD_EEH@FIA@HIAAHUEDOHAFIOSKGSEcDAEI@@CBCOEC@CDCFEBKEFIMEGEA@@BGAAERFBDQCABADQDCCAHMJBDEMEADGAUCCC@CDA@CCCICGO@BDJG@CADGK@CCGFICCBKEEDGBCAAEKDAABGFE@ACABCAAeA@HM@GBYD@BE@@NABGB@CCAW@@ACAEF_BYECII@CGGBAAE@AFC@CFBNC@@HWDGVBBJ@BFBDDBFBADD@EPCFJF@FPGCE@ILH@FFCJGNLBBEDADARAHDBMFADEP@JEJJDCDIACFILA@EFEJEBIPKFBB@DBBHBALEBANKHEBEACBCFEB@CG@CDI@@LBDD@HFCJGFC@AD@DOBAFPBF@BCN@FDAJWNKJEBG@C@E@DECAEFADIDG@ADJ@DDA@BBUNx]RYT]RFDCLJBADDBGDBDHBFJJ@TBBHB@@DH@AFKBCB@HE@@BEA@D@@ADBHC@@AA@@DCB@DB@@FJ@@FD@@HH@E\\F@ADB@ARBBBFED@BD@@BCA@HD@AJE@@ACAAHDB@BH@AHCB@EAAADGB@BE@BBK@FLEBDDADA@BDNB@DJCBBIR@DBBDBFALDX@DHL@DJFA@BH@HHKJAB@DC@GFOHED@BCBAZE@ADE@AFGACEEDA@@AGAAVJ@IVB@@DB@@DHGJB@JpFBCFBEPPBBCNFBGHBPC@EHBFFRDjG",
                    ],
                    encodeOffsets: [[120072, 40786]],
                },
                properties: {
                    cp: [117.308094, 39.716965],
                    name: "宝坻区",
                    childNum: 1,
                },
            },
            {
                id: "120116",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@BCDDF@@DRC@BJBRANAP@BCFAJ@@B@BTC@DB@JEAAB@DBB@CCB@@CC@JSF@BADAAADCHBH@HECEB@BCHBDBBCFDBAACBAD@BBPGJF@@ABDB@BD@ABBDDAFCBC@CB@CCAKNECG@EF@@EzQBiAC@Ey@BUI@±]GaQaý¥Y_YeK]EaDqPmHcD{DKQBMMaKEUC_BOASY_YAYDXSIaaÓLYASKWcgKEwDaDqLX³OqIGFG@EBEACIGCFK]EE@@DFD@B@BG@BHCFC@@EEAIHEACBC@BFCBQCaDFKACEBECADE@SSKMIKHQKHEJ@[UGCoO@d[CFSMIAIE@AH[A@DOA@AQKOEEBARGNI@G@BSgE@AOACJSKMVC@IXF@hJAFmKCHB@PVVFAHHB@JC@CH@BABD@ABMFC@@BSB@BAAAHG@JL@BBBWABHHB@N@BKBOAEEESMA@EA@@CCE@FC@AEQ@@GCAA@AJC@BEK@AAABSGA@@FEA@BCBC@@EC@@DK@LHBD@HCDBFCBABB@F@@FB@@DFJ@HB@BLADK@HBDBCBG@@DH@@F@DCJIB@JK@AJFBCLBHH@DCBJFF@PATBHB@ABDTbB@DaCAAE@@CAACAOF@HADE@@BICAFBHEBhTBPDBJCFCªvEFeVTROJVT`OFH®_\\OF@DBJHKDBDABADCB¶n`|yHVPTvbDM^JDERNLDB@TMJGHAHBCTAD@HDBARLZDBFPCDIAGBUVOFGB@LCFBLCBDJC@CEIFHTCBJRF@FXPC@@lAAVLZU@@HADBH@Xa@ANe@[BL|J\\FBpQLFLBBB@LFLFBPD@RDLpMpGBPNREHE@@dVF@BJB@BD@@DFDLBDGHGDA^c\\@@cFD@@jEBJZFLhrePFBEJGAENE@IVC@@RBLV@DPT@zJLHPFVDNECC@SACjQJBJCACIDMQhQD@tCD]LBHDBH@GLHNB@DQHBAFDHE@@DEBDFFAD@@BF@BBAB@BNFBEHCXDT@JGAGVEBE",
                    ],
                    encodeOffsets: [[120735, 40262]],
                },
                properties: {
                    cp: [117.654173, 39.032846],
                    name: "滨海新区",
                    childNum: 1,
                },
            },
            {
                id: "120221",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@EKABEGACC@IMA@AOB@AAC@CIGAAEBAECCBDAAAAADAAEFCBDB@ACB@AAAABEBAD@AG@ADFAEB@A@GKSCCgG@AEJA@AFO@ECCQEEEOBGYG@BqGBKXBFKCYJKOIKNEASCeA_ECSBGFENEF@HDZ@FCBE`TEFB@EFHFFEECBCFDFADBDEUWCOGBAIECLG@CEIFA@CF@CGBEGACRA@GMHKG@CAAG^KDCsC@gRNRJCBDIDIAiRBD@TDDMFUCOEKGyIS@COU@AK@QD@JUF@FMHBFIEAfOgqEKIYFA@i@EC@d[@]dCBGHCHKAEC@CC@@AIA@AUE@cF@FGMQAOoHeL[HSBEASDgRGD@XGFAADEAAOEBCACUFBBFALFDF@HUGOBCBHJBRSJIHO@QDILGIADIE_@AEOGSD@HFH@FEDIDELKD@RNDL`APGJIGQEEDAE_XGGQLNFUNQNKGIHLHCBDDABDBIJEEORFFAFDJAHC@CJLBDHJ@DJZF`AFEDB@BX@DB@DHABA@MF@@AZCHAN@@GfBBBADDB@BEFAHBBLCBFDBHAFCLFDAJDHEDDL@CHDBH@CI@AHPJDDD@DCB@DDDVDHBBCNFCFIAGNDBCDCRABDBCREAQBFHB@AB@HFNFEJLFFADEDCD@PFAD@DJ@BFdCTFLHPTEJGBCPVFBGJB@GJB@EFG`FBCHB@DNBCJB@@HDB@@BXjJNLGZ@DBBrMACFANDBFP@JHBCL@FFATLDADHBDAPEAC@EBIFIJGNJJ@JBJJHJHFSZA@BND@@LVB@BJ@AFDBBDEDILjTABlEHHTBvWVAPDHCDFL@LHHB`MFANDjQ`G",
                    ],
                    encodeOffsets: [[120765, 40524]],
                },
                properties: {
                    cp: [117.82828, 39.328886],
                    name: "宁河县",
                    childNum: 1,
                },
            },
            {
                id: "120223",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@bIAGSGDGXLHGFDBDVABCBB@B\\KLGJNDADHDAEI\\GCGPA@CF@AIhCbGTCnSIKNC@EE@CYlCBJJJ`W~W\\M^WV]^_°VIEG_PUSPISQfUFE©uEDIDCAAOgSFAAGBEJD@AF@BC@GPEDBBB@DF@BBbD@CaACSBAA@AGBS@OEEAICDG@AGDKEABIL@@IJADI@C@EG@@CH@DACAGAL@@OA@@GEI@CA@@EE@A@BADAAEDC@GACOKB@BMEB@ESEAABECAWBAECBBCC@CIBCS@@IWDAHC@@FCA@DHB@JS@@DA@@H]BCTKfG@BHK@@FEAADJD@RJhNNI@@FQBBDCBQA@BBLMIBNFJADHHEBuK@IA@AKU@UDDHKI@HAGAAC]@CDCA@MSAHPGBOEMEIA@EC@@DA@OB@ASB@BCB@TE@@BBBBDAHCBDFABFNGBBFKBBFC@BDB@FPC@BPCPMACEoBE@AAC@@DcB_D@ECB@A@BA@B@@DC@@CA@@IE@AAG@BDK@EBABQA@JE@@HC@ABA@@BB@ADOA@DIAACA@NxQB@FIBHXHABFKBFLIDLPDTF@DNC@CAGB@FA@BJDXmBA[@@D@@NL@BHB@H\\BTD@HRB@JF@FL@FHDNDABJDCDTD@DTA@@LF@BB@XGBADE@@B@B@DJXJ@XEDFHAFHCBBDBDJBBHTCAIGBAAGBEA@EC@BCB@@BBAC@@AB@@CD@@DB@@DJ@DDF@DAF@@CLABBF@@AB@BBJ@@IBBDBB@ACJBJDR@@HD@@GfBAFXBCLH@GTPFHA",
                    ],
                    encodeOffsets: [[119687, 40010]],
                },
                properties: {
                    cp: [116.925304, 38.935671],
                    name: "静海县",
                    childNum: 1,
                },
            },
            {
                id: "120225",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@@AECDAACDA@AACDE@CF@JMJEHB@BPBJKBEBED@@DB@DC@CFBBAD@@GDCCAFGD@BABBBADBDBDGAEJCBCCE@C^GACDCDBAE@BA@BAC@BABMF@EAFC@@C@@AH@AAD@C@DACA@AMEAC@GECJID@@BBABA@BDB@AB@@BBB@DBBDBFADBBHD@BGD@@ABGD@@EF@CCBAA@@GF@BL@@@EFABB@@B@ACJADHEBF@ABBJDBH@BBFCHAD@BDB@DIBIBCDBCDFB@ED@@AH@AAFCH@JBFEXBBB@DB@H@DADA@ABADGI@BID@DET@BGD@BCD@BBBCACAIMGICGCKB@FA@@EAB@BCA@DAA@MB@AEAEEEBG@SZOBDAJHHFCDBBABFD@@MB@ARZ@@GB@@IDFFAFABAAEDAHA@CE@@CCAFCAEDA@EA@@@CCCA@CCA@CCEAGBAAEACDCKK@CGFKBA@CAKHIICEGBEFOHE@ICKBAFEF@DI@OJIBIAABI@@DA@@CKCEGG@OIMAIBACIAC@EBCAQ@ABCAACCAEAQDE@EDE@EFB@A@ABBDB@BC@DDB@HEAGDGFCB@DCDADI@@BE@@BABC@EAA@@AAACBGAAB@BI@EADCE@ECGDBFEDCAIBE@ABE@CICDCACFEA@ABABIFCDCBEB@DABIQMAIA@@GC@AKB@@ACCCCGDEKGDCEEBGKBM\\IGIB@AGCBCC@BABCEAFE@@AOADAAEF@@BF@FHAEBA@KBA@ECBBBCBACEB@CC@ACFAFSL@BBDEDiRUC@@ADAFEBGHBNQBHFCCEDGIABICCADE@ADAAC@@AD@@CF@@EB@@MBBD@@AB@@BD@FBRWFQ@ENAACC@ICK@@EBGACACIGCILC@CFAIOG@CCEBCCK@CDBHI@A@CFCAAEC@IJAAAEG@CBEHAFG@ME@@EPABEGCAGFEAOB@AHEQIEAABFL@BC@GEGIGBSIEQMBGDWDEFBJIHE@IAOLBLI@DFABCCIFM@AFQB@FCBCCKAMDGFECCFECG@GIGDC@AFCBCFFDCDKFOB@CE@@AC@EH@FEACDEAADGAAHDDQNGAGFC@CAIDC@CBCFE@ADHDCDDD@DH@BDOVAFGFO@AAAGA@KBCGA@OHE@IAAHG@ODEAE@MLA@CEE@ADBFEDCA@CAAM@CDPJ@DGDA@@ECCE@CHIDGEA@@FDFBHFHSNAFBDDBNFBD@FEBO@E@EPKB@DNBNDCDCJ@DHFD@FCFDADEHEDE@CDBDHEFFJFLBDFAF@HAB@BGDBBJED@F@B@DGD@FLBHCBBBALTD@BD@@DB@@JF@AFHB@DB@@PCHB@@HBDABCABDEJBJCDE@AD@NAD@DBRABDBEHEDBDCHDHDADABBFA@FBFTCBAF@FDDCFBJAHD@BEF@BIFCLGFDDHBCBBB@BED@LN@LCBDADHDBHNHDHHDHAHHHA@AD@@CJBNCDEBCHAFFAJFBBFD@DFDBH@FCD@DAB@@FLHDFBFBB@JJDDBBAHAJFFGD@DA@ENBDBJAJDFJD@BCBDBHK@@BDBDDA@G@DDJHBBD@BBEH@FIJ@DCB@DF@H@B@FCBB@BA@@BDB@DDAAADAC@ACF@@DBA@ABB@BDBBBF@D@FEDABBCHDCDBBAP@BBEDJDJHHA@DDBBBEBEFC@CDIG@BCBCAACG@@DA@BFBB@BA@E@AD@BAB@FFFBCAAJDFAFBKHC@AAC@AD@DE@BJCDBBA@F@DDL@LBAD@DABCDFDDF@BFBJA@EDABDDBB@AADBFHDABBAHCFFJD@DBDAF@D@DCD@HDBBFDBDLADBBAF@NGJ@FCDCLABEDBJ@DCBIHABAD@NCD@JGFBN@NDF@BAJBJ@DBF@NDD@@EB@DCD@BDTALGC@D@ACDCBCEIEAACAECCDAF@JGBAAIFC",
                    ],
                    encodeOffsets: [[120398, 41158]],
                },
                properties: {
                    cp: [117.407449, 40.045342],
                    name: "蓟县",
                    childNum: 1,
                },
            },
        ],
        UTF8Encoding: true,
    });
});
