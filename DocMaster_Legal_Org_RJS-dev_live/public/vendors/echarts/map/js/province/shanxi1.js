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
    echarts.registerMap("陕西", {
        type: "FeatureCollection",
        features: [
            {
                id: "610100",
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [
                        [
                            "@@D@@CMMAIKGMCCHIHJLABDFJHXC",
                            "@@DFJFtBFABGDCPBDCH@LBF@LGFAB@FFDLDDFBNIF@H@LHN@DCDKBCF@L@N@LJZBNB^HLFDFBJDDJDFHB^DLDBF@RA`DTARHB@LKFSBGFEJEDCACICEI@MFIBELG@ACCECECBaJgJoAQFIBYXBQKBMEOCQUCCaEGDEAGKBIF[BCVAHGBCCCIBG@ECOaAODKHCFATALG@ABORKBEAEEEHEAK@IFEJEXEFIBEASLCTA@CFAGABKFBB@@CAA@CECDAAACABABEECDC@CCCAA@CCAACBAAABEB@@CB@AGAA@ACABAACBACABACEBAAABAC@BCC@BAAEDCCCBC@AD@ACB@@ABA@EDADAAIAA@CACBCAAZALCDE@IJEFGRIHIHCJAVIJGDGD@JBJFVCLBJDHHRENBHCBA^INGVEJGbKB@LJHFTBHAJGJEP@^HJ@REP@RGTBDEL[DGJEZADABCAGKMOOAEDAJ@JETDJCLALIFIJEFIJIHBPJVU@GKGE@GHIDEIUGCHBHDFHF@BKDOAQWGOSUGESCEEAMBMCK@GECKAE@YTE@OCCDCLEDEGECQGWGE@MFGFACBECGGKMEI@GECCAOSCCGAIIQCCOECMECE@G@CNKBEGESGCA@WCIEUGE@CFGIKAEDEHERG^UhMFGNIRAFE@GCIIG@EDWI_AAE@]BECEECAI@CCAGSOGCI@AACWEEWESCCAGMKBMAWBQFI@KEAGCAKBEEACECA@IJCBUAIDu@EDCL_@YNILIDGCO@IGQDEEAAGCKEOBEDKAMJENEFOFYB[JE@KGSDE@MGKMKA]BIBIHEDOCIDMEGACBGJU@EGG@OJK@CCEBEH@hKFGJIBOCQHC@[GIFBJGHQBEHC@GACCAGMWKIEGQGIKIEW@GCEIK@KCOBEBE@MI[II@GAE@MDEDGAAAEI@I@GAGAEMKK@AGCAKEG@EAGGGCGEOCCDSFCGKCAICAGDE@IHC@GCMCGGA@A@IHA@AA@CICKIC@KDGCGI@GgXEFCFAD@FHNBJ@FAFABI@KAIFA@UKIAIGO@GEG@KBCB@JEBMBUCWFM@KHA@KMMEgKEA@EDM@CECEACAAECCACBEEOCAEACAOOEADGDGBCACIGMBCAIBU@CDITIDCFCNMBEDM@IFIAGBiLIHG@KEICOBWQGAMQOEaMGAA@EMAAK@CBADQN@HAB]FCDANEFCBWCWDCEBGAAKAOECCAGGIUICCGAeHE@EACEWKSECCBCACGCEGQSCGMCE@E@QDIKECEBI@GDGDC@AAAEAACC@GAAMEOFQCKFCACAIAEFOFKHIEE@MMG@EFKFMJ_DQCSOCECCGAYFYJOLOBMJC@AAE@QHI@EBUFQASNGHA@QKMA@GIGIDK@EDEB@DCDMFELCBGCAEGACK@EAEQYMCCAOYCIOIC@MHICM@EDCFGDKJKJQGC@IDWLQ@GFMBWGSDS@_PW@WCCF@BGFC\\MLOHOLCRTLJNBDADNJBNIJCLVDPPBZJDBBBFALHLAJEHL^F^B^FTGb^HDBFFFDTLjRBB@FFHJLR^JHVDDHPLPCVGFILENKFAH@PFFDDHPLNHRBLHTBN@DIDGFIHAT@NCL@JBFD@DCDBFAJEHELBXEL@DHRANDDTBDD@F\\RDFAZJ@DHRNRXDDFBBHC@@DDACDCLHLAFANBDBH@LCDCJJBAHDHBDBALHFHFVBBJBDF@FCJBHHNDTJF@FGFEVTBFDJBDAJAFFFBPBFAJ@JBT@JAHAD@BEPEN@VIJGN@TBFFNFXBf@dIXOZSRGfARBRHJFLDRBPAlMFGFCRATBZHTHJHPBL@zEXKPDHBHHJDLBF@VGFBrVJLFBPBTFLHVBLBR@HEHAH@F@LNFBV@NDbRFDDHJHLBBEpTH@FCFQDCHCDKDAjODDAPBNHBL@@FGLAH@HFD\\FX@LPB@J@ROF@@HHDBF@DMNDDDBrEXBNADDDD@DCLCDFPANBFCL@HHDBDEFBDJB@FCDDHBNRNFDbEHJLFPNLHJHXFP@TAHBPHNRDBHBbAJDNLJDLFPNC\\ENHHLBFAFIFADD@BCLAJCNJRCNDRCLDH@DIHABDHBJBDBTCNBRADMDEDAJAFKP@HBBHFTAVDHLD@LAPBFDJLHDRBJFJB`BrBJADEDAZBRKJIFAJ@dFDBHDBFBDCVAH@\\APFPBNFFFDH@NB@N@FTTJJ@FCJ@HBFFJBD",
                        ],
                    ],
                    encodeOffsets: [
                        [
                            [111793, 34623],
                            [111794, 35525],
                        ],
                    ],
                },
                properties: {
                    cp: [108.948024, 34.263161],
                    name: "西安市",
                    childNum: 2,
                },
            },
            {
                id: "610200",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@BCAEKKUKE@KHC@Q@QIC@EHA@]MKMUMC@GBSLCAACBGACOCIIAKDM@ESCCCEQUAGCOCWI_C]OGGIGGAMBCA@EBE^AJGFSB]BGFGJIFSDAT@HEFKN@JIFMLGBKFGFAL@JAFCFGD@TFRAJ@JDLHVHJAHGBCGQDCHCJ@AIEGAC@ADCFK@EGeFgCGQECMEKUFEBGZADCJOBIHSFK@IIIHI@MDGEMCOGgA_EMEAD@LKLUHG@CEFGJEDE@GAAIGMSGEISAOGCADMFOEOGUBEEAMICEEDSMITSACEGO@GBUIIBGDGAGOAE@AKABGAAWDQLC@QIEMKKOEMDKAACAEEEMIEAKBAAH_BEPM@COGACLGBCCCIAOIEAMCKDEC@EBEEK@EDGACCAEBCFGDAHCD[DEAEEUIMAMBICY@]IGIDmLOF]G[SBEFCFCBm@GBWHA@IQU@GA@AFEDG@EEIE@K@IFGHCB_BCDK@CDOEKKUCGECEC@EH@FCB@BDAAHD@BDE@CD@HAJBFC@CCOREEC@BJCBACA@IJIDE@@BDDMD@DADBBADKD@DBDCDGABJCACD[AMDgKC@[HABAHCFO@EJE@EECBKRAHKN@NKJEHAdMXMNADCRCLGLOBGFUYRQBGJKJIPAH@DJHDHFF`XDDFPLLBLDJHL@BC@IAGDEAEBMICEG@IHAHHDD@F@JBHFDLLHNBZFRCJNNBH@DBBD@DGLGTBROEOAEDGLAHRVR@BDFD@FBFAFDLBBH@BHFBXEBD@JOPBDHHNLNGH@HHBRR@DB@HJDBLLVVLHHJF@RFNPTPDPADDHJT@JFTDF@FAHGD@NHNFHRNCH@HHHDFBTAbJ@B@PADGH@HFHJFJBPCXBFDNLNBLFVZDLBHFJf\\LDBDANVL@JBDNLHF@BONAFBDPLBBBNHJ@JDJPXXNBD@HAJ@FXDFF@FBBHADB@BEP@FNLLFJFBD@JDBL@\\GZ@JCDBRTXJFNFBR@LJT@R@LDJFdHP@NARBHENUFEBGAEDGDCHFF@AMBCXeHEnIh@FDJAL@HCBAJFP@ZEJBPJF@X@RCXDbCT@D@DGBCEEBALCFGHCTED@HPLFP@B@BABKDADCHDBHBFH@HEDEBE@EAAGEOEEC@AHCPFDC@CCCUIACFCTBNADABECEeSAC@ABANAR@OM@EB@N@DABG@EACOUAC@CDCTCFCBEIK@CHCZK@EGIBIKG@ALCFCBEA@MECCBCPI",
                    ],
                    encodeOffsets: [[112124, 36206]],
                },
                properties: {
                    cp: [108.979608, 34.916582],
                    name: "铜川市",
                    childNum: 1,
                },
            },
            {
                id: "610300",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@DCFB@CD@@CDADCFD@HFBJALDFAFDX@NDD@DB@JBBNH@DAHEFDJDBJIBEFDVBhCrIrOvKTAVJPNFB^ARDJI\\LDEJCBABODAPCHCNA@HBHDBVEBEDODEJCTAdLN@DACEKI@AHCTBFENQJS@AEKDAJ@JFD@NGD@NNBFDFD@FED@HDBACGCOhAJCHBLCLEPUDIAMKYCQJMFCHEBCBEbSZEDDDID@BDLAJBZEDEPGFCJMH_DSHSVWL@FBB@BEFCFBL@BDFDHTDETA@A@EB@JEH@DJ@HLTFJAFHBF@BBLELDBF@PBNDFBFHFJBDbEHAFEBEJOJCP@FBHJNJPFPBHAlERIJERENCR@VFH@NAXIZ@LEPAVFDF@ZBHHHTHFLH\\DHDFNJF@HAVILCFCVEHDDDJDF@LCLKDEBGCO@GGWCIECD@PBH@FCAH@HAJ@DBDJ@HEFBH@DFB@BFBDDDD@BDFABJF@FFBC@ADAHFDBHCBDF@HAHBLAFJDDDJBBDCBEBA@MPBFBHDJ@LAPHRB\\JNBdGRGENCHDBJJVDDAAGAADEFYJSJaZgBEHQAIGCCFCADC@CDABEECDA@AIABAJ@DBBDBE@ELOCCHCE]BCDCPBDCF@DLCBADADHDBGLA@GBABCFEHBDAdBXHZLXRJFF@FG@C@QAOCOCWFMBMFGFCHGHCNG\\MHEFEBEFSAKDURSFIHSB}LcESN[AgNQuWGBG@CE@OACIGGII_AIFKDAH@NaLOLIBKDK@]EQEGGAAQDCF@RGJGCQCICO@MFKGI@EBGLADCJQFQN[BQEaBMDIR_H@DEBODSCGEDA@DCCCCDAEADC@CCC@AEEDAAACC@E@@@ADCB@BB@CB@DCAIB@CIB@ADCGACFCB@BCBBDEFEDBFABA@@AC@CCBIDEAA@EC@CBEEABABEE@AA@@FKB@HGC@BBDE@CFCADAAAEBAEUBMKAGB]HO@GNBDANIFARCJQCGCDCBEAMCGKGAC@KFCAWP@NFFDF@FUHE@EIECSGMAGDI@ECEIAAAGYCCKGABACCGBGIADIDC@KAGACBMBEGKDKDCCB@CD@AGEACCQWQMCGI@BYCE[Q@ECCSACCBMGQ@CFKAWFKFGBIAEDC@CECIAK@MDS@GBEJCHCJM@SAKGQAMGOKCGECOEG@EBMLKFEJUHODOKCGUCIGQ]IKEG@EAAiQSKECEECA]GHaESA]E]K]FGBIGKBKAEAAICAYOOUCDKJIAMMIBCACIMCCMGAADG@GPKPGNKD[HE@ADEEAIEGICQGGIEEDKGI@QFEDOHGJIDEBO@OCWO]MG@EBKBUFIAGCCEOMQIKEG@QG_FG@IAaSQSWIcG]Ec@KDS^GHKRGJYHY@]D]NSTE@EFADJ\\HJSJCR@`FRPJLAFHBPFH@NFHLDHFHXQ@ILG@CACK@EKCQUMIMJQ@MHCECOOEQMMCIIOEKGASEAMAOKcFOACDDDEJERCFKFEHMREBICCCCBMRaa@FBRJHCPJZCFG@ME@EECGBKFEFELABO@UCKBQRIPCHAN@`ALGJCBM@KECCCKCUJ@M@GSOKEQCY@MDEDeJs\\IDaVELE@EDWXE@QCG@IFBFFFADCBCD@DK@IDKFOTEDE@CCCCBI@IDCCECI@ICEIEKOCQOFOBMHBCAEGOGCACCOAYBcA]AiAQ@eC[ESBE@CCMECIEOHyTeLOBYHKAGBW@S@IDEA@ADGF@HAHGHDFABKDEFEJKKIEBMGEEI@WGC@EBM@MBEEG@EAFIBA@GFIBKEGc_KWCUGICBE@CCQIAIECE@KBKHCLCPBNAHDBKlS`GHWnOV@FEHIHSJWB]@_NEPHNFTAPDfCZENEFGDE@OHGFAHBHJTDZNLbRFHAPGPINMHADADANABG@E@GPC@GC@AHABAAAKEG@@ABCF@BAYI_@EBKN@F@bABENEFCFHJPFDFRNDHRLHPLLDHHDHFDHVZHT@VOhATDHLNPHJH\\\\DXATEPC`@H^JJAt@LDDAFBHA@B@DJPDH@BD@@DLNFLHD@DDLCFOVCNEV@HENCTG`CJAJIVCJONGFGBGBKGYUUEMDAFAF@FBHDH\\bXbJFVAXIVADALARCJMJaFGHANADALD\\PJBNAPMJKNGVATJLJFHTnRXJRATGPQZCJBFDDH@LFRDFDFN@bE@ELC@GCEGE@GDCLA@CBIEG@ABDJGFKCGBGCC@IFMNMAODAFHJ@BGFKCCJGH@JEJDPABGBGTBFHF@DE@ACC@CNCDGAEICAGLI@AB@DHHFBDADBBBADEDUCCAEDADFDADKFMCGF@DBDHBBD@BCBKEI@ABALCBEBGAII@CCEAAEBAB@DFH@BEJIDOAIHMBCFAHBHDB@HE@ECI@GDG@CDGBCNCDC@CCEAOBCBBJEDGCAA@GGAAB@DFHCBEBEAEMCAWJIAKEQBQCIKAIAAAAIAG@IDAJBFIDC@OMGCgNKCG@GB@DHHBHHN@RADCBADDLFF@FCFAJABKDCFGDMBIDE@AHTPRHJBVJdPFDV\\HDDBLCDDF@DJDBFHFDLCHDJJAHHRFA\\WDGJ@BED@TFLCNE@FABC@AFBFD@DBADFDCFCDIH[PABIFGLANBDLVXV\\JH@TJLLDFJdBDJFXAx@RL@JILJDLDFCD@VLBFHNARGFCDEBGDADBJALGFIBEDDB@FCHCNBBH@ALBLFJBHCNCFIH_NGFGDGLEFENGnGVUPEFGJB\\APCFALEDGNDHFFPBHDBDDHIDCBAFBDAFHTABG@IHHDHB@@@DFJHFHAFCN@HEFDD@BB@NHL@FFFBFBDFLHND@BDARCJ@BBDNBLFHBPSFCDBBBCJDFDBHCH@JCPIHCZEBEDCFDHCD@@DBB^CHBAJJBFA",
                    ],
                    encodeOffsets: [[109211, 35920]],
                },
                properties: {
                    cp: [107.14487, 34.369315],
                    name: "宝鸡市",
                    childNum: 1,
                },
            },
            {
                id: "610400",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@@GHGBC@O@AaISBEAGCGGG@MDGQMEMGC@GHEBE@SCIES@GICCOBOCOSEM@QIEGGUKKUAKIC@GCAQ@AQGGG@MHMKGGACPO@IACWFEAAGG@AACKBEAE@EECACQ@QUBGHKFCPBPFAQHSHK@CACCAG@MAIMQDYEMAKGCKGEIAE@C@GCBGJGH@DFNJFAFBHCJBD@@AGKCIAKKKEOCC_WEECGIG@CBGJOLIHIRAZQVHEPAHKDKDQBCNMNWBcFGLI@MLMBGLQDAFFF@FIP@DEBGBA\\GD@hLNC\\BDCDBAIHBDCAC@CLCBCAABC@CNCCC@AF@JCJIB@BDDAAID@FFPQDDD@AEBI@GDCF@ACC@BGCB@ADA@EFGD@DFHFVDLLPFDCL@DC`ADAHGJEL@F@FJ@FCHEF@BHBV@JRB@XGHAn@DADEFETAN@HAPMBIJABGF@AEFC@CHIFAFIBGJAJITKLIDGBMDGCE@WAECCSE@GB[EMDCRMPSFDRNJJFVFHHFHAJCDCFMLGhBPFJAPEZDFDFBf@JAFE@CIIAABGACEIAE@GDI@EIISS@E@MMAG@ECEEAMEOBO@[BGDUACAEKEcEI@EBYVG@SAABEFCBS@CKAIEQAGCIKECOAKBC@GKUCSBGEAA@GLOBEBIFCNCBCAQDMASACAICGBAJG@CCGDKCQDMIQDMBIDK@ACCEBEJEBKAGGFMD[OMKEICMKICaBGACAMQOGGASBO@WEIGKGOMKEGIaFECQMAMCGDC@EIAACFEACGC@GDKAEBMEODCDK@CCCCCMBWAqFCACCNM@CAEGC@GE@QPI@A@KOW@[EEC@GBGHK@EK@GAAMBOCCiPCBCLGDCDEREDG@oSAFKAIGCGECaQMCU@EAKME@G@GBGFQ@KAUAKGSEOAEAIKqUEAUHE@KAICGGGAOCWLyFK@OAIGSGYGSAQBEDEHkNOBQAKCIEQGQAeBQHYTWP[HOBk@IAMEEEEAM@M@IHUJM@OFAFC@GBIBS@IAI@EBOAEAEEIBCBIAECI@@AM@GCMEO@BXED@LBDLHDHBNAFCDDDHIRQDEBMJCBMA@HGPA^BHHHFDVABFFABBCBDBDEF@AC@AHD@GLA@EB@@BFFBADADFDAD@@FBBCFAJDDD@@BB@BAAEFCFEACDA@ADADEHBCD@BJA@DJADB@CDAA@@ADABCF@B@DFB@FCBFD@DDD@BCBFDCDDCDB@FCDHCTAPCFG@Q`CJANFbARM\\ERIRCDKBAH@FHJEL@NDPDJDRIHQHE@CDBRHBFHFR@^CLALKJKPMbG@CBELBJJ`HJJHBD@PDFH@HAvXMRBhM\\FTKdA~GTEJQTCVBLETAFEFGF[NMHGDGHEDEHANENDXDPBP@R@DEHE@IEWQYKWGcACBGAEFADAB@HKBAHGCBCBCDACKE@CDOACDAHDJBPGDDDKP@FAFACCAI@ABJB@BCBFDAFCB@DCDDBDEHDBJGRAFYhIbITEZCFBBBHD@FFJDJDFADCD@BBCLF@FGNFLFHPBB@HKDSCIF@DBDELAHNJBFUDSGEBGDM@CBGHQJGLQPCHIFGBAB@DCDA@@DCBA@CFIBEFCLJJ@FOVOBWhQ`@FCTABCJEFEHAFDHD@BFGDYrGJCBCLILELCDCBYIABCFABCJCDELFH@FEDOABLFBJNHFFBVI\\APJHCHQHEFAFDBB@FCHEDCHRXFDHBFAHGD@D@@vEJIFQAEE@EEAGACB@DNNhLLHH@FKDAPBJIJ@DDHADAHIJBB@BEFDDAHMDEH@FDH@HCHKDCFANBDID@NBFFDBHIAGDAXABA@GJKF@RHX@JBHAJDLEBGFCLBHFFBFMFAFBDFCPBDDFZBLAJG@CCKIGGKXELBFCHDHBBBNCJDDADDDADBF@FDBAFBF@FBFADBJBBBH@JBFANFFAD@JJFADBD@BDDDL@BDNDDF@D\\LFFR@DBDB`@DDBFPHJ@DAHGB@BBFJ`TH@JHD@HEF@PBFFxSDIFEDAH@BA@CIEAIPUFOFCDBFDNBDBFLNDJ@JIPBLBDDL@F@FJTLRFHHTJXTHDDA@GBALAISRKB@JHN@JF@EBAh@DABG@@HAHBLCH@FBtEVDDANDL@FADAB@DALBLFBDHDNFP@VHJHPHFJHFHBB@BEJBJMLIFAVBHFBJHNTBFDFFP^JF@DGHAlFNNXDJC\\JNHJDZGVO\\CX@bALMVERALBLFLXXHT@BEHJHNILBJFDCAEBIBAF@RJF@HGD@CE@GJADGJBBC@GGMBCNBFGH@JLFBJAPETENBFELOLGtINMDiJQNIHO@_N]FMNOAIECCE@CFENBFAdHFABQAE@CBAL@FCAEBSBCXCHELB",
                    ],
                    encodeOffsets: [[111482, 36193]],
                },
                properties: {
                    cp: [108.705117, 34.333439],
                    name: "咸阳市",
                    childNum: 1,
                },
            },
            {
                id: "610500",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@@MDO@MEQBIHKBINGDCBEA]BGDCRCBAJm@GIQKAC[}u¡GSQyE[EOGMKMKG]IGEKqßGOGGg_IKQUSQQYIOKc[ïIeg½OeG]G_G]ISS[WYYWMSO]OIIACCAECKAIBCFG@EACGOAE@O@CLEDE@EAKM]coGqFSfuJYFU@_KgMYEUCYFSN]P_TYTQTKNGVCCXCbIIYGWGK@EHCLCVAP@HBJFBI@GaKSKC@GCAIGCEGEK@IAGFK@CDODE@IBCHA@ADABADAAAD@@AACDEBEFCFKNI@A@GDE@EHCBEFECMDCCAFCACNG@AAC@EJGdSOEI@cFM@ICGCCGKGSBYAIBICM@KCMBKHWM]@QCOFSN_LSAOBcPQC[D]PCHSDGFABSASBKGEAcFU@[QEAG@SMSBIAAAAWAGQGU]IAMBG@GEMEIGR]FCJYNEBCFOLE@A@[ACGAEGC@UBOJGCAE@CFK@EAWBCJKFW@KEQBCDCNE@@EECKMHIGICEIEEC@IBMMWII@EAGBGDMN@HBDHFDLCJDJI@ICSMUAKGIFEHGBGFYBKDEH@DDF@FGLEHCJEBSCSGAHMJGLMHIJE@MCIGCEEMUCOG@ADYJ]@ECIJMGBQL[lGB]@GECKSKBAHIPiQBIFCHK\\CFSAQHO@QFI@]GO@IFIHGBSAGEKIA@aLIHUFMH]JABGDMAQFGGICKAUDIEIAC@CHIHUJIBGDGJQJEHIF@JCFKDYBBBADBD@DBBBJCBCB@FAB@BA@BDC@@BADDDCDBFABD@ADD@ABBBABDFABDBABBDABDB@BBBBHA@@DA@AFBBABBDDB@DBBDD@DCDFDAFABDBBBCBFD@DBB@DA@EAALHBEB@DQ@KFABBJ@HAFEJWFIFCDALBLGFFFBFAFQLAP@BKHSBEBGDAJAHBJPbFDH@JADDADGHUBADE\\AJHLFBHCbFDDRVPDNFLAARWAZEJBRIpIhAbFDFDDD@BKHAFEJ@NFJJDBDCDIFEFAHETKLA@QGSB_CQBE@CACKA]EGICCCAICEKE]GMAYAKIM@K@E@ADCLCDM@KGG@E@MJEACCCKEEA@EBKHE@KAG@CDOACDAHEBsAIECE@HHHBFEFIBkAECYCOFIBOEgAKHENCDCDIBGAEEEKAICIYSECOTSPADFLAbDDPDDDBF@XDFCHANCHKJSLIJIBAHEJEBGJ@DEDBFE@AHIBAJKLGDQ@H\\E^KPCnBBFHBBVHL@T@JDVAVHFDFFFB\\CDCBGHCDEFADBBDCH@FFLAF@FFDLCNDFBPJJBDDADKHBDPH@DONAFG`BBLAFBNJFFBFBDLBNCPFLLFNRJD@RKXCBBAHLB@BBFHPHBHCJAVJHAP@FHBDSTNJCTFFJDBNFFVAPHPFNEBCHDBPJTHFNTJHBB@HCFIFEHDFH@VGLK@KBCNF`FhBPHNDHFNCJ@JGJJL@TEJGPADIBCHYFAVEFLDNRFDHEhHf@FELCD@BBDFHBJI@GDCDHRADGHIBUGKGICI@QBSEC@EHEDIBK@EBEHALKHENIJM@ELGFS@CBETIJEHAHA^ETIH]BAF@FDBNAHBJHHH^P`DXJPDHDVBFRDDTD@FCNBLJJPDBDAHBDDBTKHAD@VNLN^NB@FGD@RJV@NGHBRJLLBPDBJAH@BD@FGFCLAFDFNHFFAFGDCHBHD@FCFF@DEFDHAFBD@BJFBPH@FADBHPJHPLFBLATAPNB@BIFED@HHREZDXAfM\\OdKXCXQRER@RBLD`\\\\RRBN@HDjFLDdDDABAJYF@LFHBLAXSDBZRNFF@DELGCMBCPILCJADBJDNBFAJCD@BB@HBBJIHAD@BBJPFGNENAZAF@LED@@BAZNLHD@B@FDD^WHW@EDAH@FHDBLCD@PNLCNFDDHNFBB@FEHK@CAGCC@CRSN@VTTZ\\BDBDHXVBFANBDJHF@P@PBVFVLJDNP\\NDFDPJHBJHDRDHHAjKZAFPBxOVAL@HVCJANNHBDKJ[HKFGFCF@DFPFJGF@HEH_NKJCHFP@BIDI@GDIBEFIFCJGHGFSDWAMFOJQBcT@F@FXJHNTNDJHJJBNBHDZDlBNDHDFAHGFAL@VAVERDPAN@HDFJJFFRTFDFDBPDT\\LCf@LBJFJDBJFFDLBFPPFH^RBNDHLJhDHHXJJBXAJBRJVDpdVBRFLFPBL@@MBQJMPIHMFMBI@OCIGGAG@EBERWDE@G@SBW",
                    ],
                    encodeOffsets: [[113232, 36595]],
                },
                properties: {
                    cp: [109.502882, 34.499381],
                    name: "渭南市",
                    childNum: 1,
                },
            },
            {
                id: "610600",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@DCF@NJFLBBFABEBUNAHZGJGVBDHHPJDD@XBBDAHKHcFGHCRCXGFCJIPEJ@JDHFHBHUL@PCD@FHJDDELATIDMAYGYMQCI@KAIEG[IU@KDELKJIBQCIEACbaHINKFIAUIQAEDOV[DAFBFLFBRNFDLBHADE@UESKYAMGODADONSToAOD_JITIPEVKluTEP@PKFEPBPFjNfJLFFHLVHLDBT@\\CzOZWXENGBKHUPEP@VJh^\\AJCRMNWAIJMCE@CBED@F@BDAJDDDJHHNCNAHDJBHF@HB@HAP@FJDBLSBKAMCIIMCIIo@UCOMKEAKA[@ECCE@CFGLEHA\\@NALETKBGA[CGCEGEMCCEBEBAZEDE@KG[QcIKICUFKACCBEDGFAfANANCHELKDIAGIISMCE@C@CBCLCJBHFHNLJNBFAFG@EAE]_CGAGBIFQ@GCIEAEAMDEFKPEFKDK@MGCG@GBGDGJGPI`MHGlbeNMJGVKPEDADIACIMEOAOBETUDEBKA_DQAUBOAGCIIKcYEGCE@IHQZSDE@G@IG[AI@KSaOOAOBSCGKOCI@GBGJQLIFI@CCEGIAKBCNSBCAUDO@GEQEIagCI@GBGLO@G@ICIO]EUFg@SHYJ]DETUBSEO@CLSJIFMLOJUBWDMHOAGKQBEJSHCPEHCFGC[CCICGECGBIFMBCNMDEBECMCKDQ@ECUCE@C@CJCVCF@PFJBNCDC@CASASU@[K]CocUCQIIAWBIAWIGGgCKICGAM]QEGOOAECKEEAIICIEKAe@KDS[OCCACESEEQIEEIGCM@OBQCUFUBK@EBGHEBGCMCO@eAOCGCMAIAGICISMGMWI@GBEZOHCT@NINEXBTCHEHGDIJEFEJAHCJ@JC@AEODGLI`MFG@GHEEIEO@CDEHELE\\GLIACMGBMDIGUK@UBwPOABELYBiGGQCGCAIIGCOCE[MMOICUKUEOAO@E@IGACBMAEWUCGCA[ASYUSM@QT@DDDBH@DGLGFEAGMCCMEKDOMC@KDCAEGG@CB@FGX]XCC@E@AGCMKBYAAE@GFE@YBMBMFEHKQC@GBIJAA@GAAC@IDEBMAICCAIBKDKHEFDNKHCFE@MEYQCAWTKBGAKEE@IZABCBcCKCiEGC[AKCIGIE_[KCQAQ@QFWRWDcL[P_L]DYCQFGGC@EFAJA@OMaDSMIGGOCAEBG@AOIEACBGCGFE@CEEGDAAAEBCJGBEEEMGCEBEDKHE@EACG@IBCAAEQNADDDNFB@AFEDKD@BLHAJHJ@FYLGD@DJLAFEDSDCD@DBDPVBD@FAHCBM@A@@FPNQ@MBAB@BBDfTDFAFCBMBSAEDBDVJDD@DCDOEGD@BFDPFHFBBAJILEBC@AEAGGCCDCBALABA@O@KEGOC@SFGDEHKDABFFADCHC@S@aDWCQDW@E@OIIAYFO@IEABGDK@IBECg@iHCBGFWfADBNE@GECDCHBFAHEFMVGFQAMBO@cGOGSAUBCAIIQ@EAEMWIQSCAIDY@[HM@AA@IACIEKEMK@EFO@ACAGBAA@EEEWC@EBI@GACWMOWCI@IGIAMAAOKACBEPM@AGEMKAC@IUKBMACKCe[EIAGCKUYKEMAMKECWAODIAIEEGEDGAGFWDADATBFEDK@AB@DBFAREBcGEBMAEF@DDFFDBJMPENM^@`GPMJIRCjMNsJKHKPEFMASFOFIBEAIKG@EHMAADHPAHI@CHIB@HDFC@GHG@GEIECBABAJBFCDIEKAMJIGCFBPCHADKDEHQBIFSVEDG@GHODANELCBCBW@QLC^KN@FCLGT@LETDNFJ@DFJAHCFKFGL@HJJDL@BOJAJBDHBHJJN@NHHCHQRCJAJBHHDF@PE`KTgpAHBN^^JPHBTD~ZFXFNLJLFPFX@\\ANEZCXBNFJHD^@bBNDF``NJJNEhG^BNBNNhblADQLHTNRHFGVKVYhsGRKRQnBLJTFHGNMfCXDjETBdH\\JX@@CFIHEF@FEFCBCCE@AF@DFHCFANELEBCDGPMAOCU@SNOBY@IFGLWFSHCJi^AACG@MDKJMBGMSW[C@QNSCIGIAKBIJ@FGBQBUFYZO@GCK@ADDJJLCfABMDBHIPCZCBMAMTMDGFADDXCNINWROFDIAGCACEEGACBCHGJKDKHEAGEA]AACBSTCDBJEJMB_CMDKLE\\EJBFAFDHC@JJFH@FD@ADDDDBDFDD@DDDWHMAMGEIGSQsMYSYCAWEUDC\\ADWFUJSDYAAVFNABCDKBCLCBCC@KCC@EAAC@GJE@EK@EGKA@ABCFCBI@IAAHEFBFEBCCEDG@AB@FBLADUFCACGCAGDCCAB@F@FCFHBHBBFEHQDAFBLFFHEDABBFANFBB@H@FCHJD@HCJQH@LEDIDE@ECA@@EA@CBIEEBACE@@GBECCFICK@GIDCFCD@JCFQKA@EHIGCFA@CEC@AEEGELIGCFFHAHDFCHBJDFA\\EPIRECEDC@ABAJIFGB@DAPINEF@HDLADACE@GEE@CFQCAAC@CBEPC@EBAAC@AAC@AJABDB@JC@EDG@ADIA@AA@ADC@EDAHEHC@@AC@EFADEBG@IOAACBKDOAGFE@CF@BEDA@@CABCAIDKBCHAJABG@EKABADIFGHEBAFEAADA@ACA@ALCBKBGACBC@@MA@G@GGGHA@MAIPKFKL_NGHA@NJJJVPTHfJJV@DID@FHZ@HCJ@PBNEPONIhEFMHBDJPADKDMNFRHLB@DEFSBABFDEBFAHJ@DDH@AFA@@BDDBFFDAMBCH@DGFDHEBDADD@@BF@DDLAADBLAFHHGHK@GFADKF@HABKCAE@QIEC@CBCHBVYBAACMDEBSMAELDFCBITAJ@FGBCDC@EFBJALCDG@@BDDABG@AJKN@F@DFBFBPATKBAAGBCHAR@DDNXLHFHNFAHCFeVBHILAF@DJLFB@BCDMNC@EKCAEBGFEAAFBHNNNCPNFABPCFDADCACHBHEFDH@DCFGJBNATb@DABEBOEOLAFLNFBTDNFBFADABI@@DDZAFIF@F@DF@J@DBDHRPPRFDVADBLRPNF@PE\\@DCDCBKCEGGAEACBC\\BLGXHDALOHWJmA]RCBA@QVgDOBOI]@EFI@CCEDKJCHEARHANFBCD@DFBL@BPENBHABENK@CHC@FB@DGDD@CBCF@DHD@FCBBBPLNFDF@JCFAB@BF@VBB|VTJVDLELCHBHHDBNCTHHADAHGDAF@TDNHV\\FNBrH`NFBBIVRDDUDIFCLAL@HDDJBJFBH@NCDEGUDM@OFKLAPAHBTRHBJCFBFDHHDRRNRLTDFTLHDDBL@JC@MD@JPFHBBAFIFAFBDD@FCN@DD@NEB@BDBR@DEJIDaJEPSJEFAFBFFLBH[HEDKPKHGN@Dh^FBLBdAHFXH\\DrPFBHHNDJJLFDBVhLJBNRFBCAEMWAEBADAT@\\EJCNMB@D@BJHD@BAL@DDBBD@JELBHDDH@JCFEJSLMBK@UG]FOBK@GD[HWXGncVIFC@EAUCAM@AAAMACODEAQGCCAABClOHCRUFATH`IDE@AMKACFUBGHMLM\\QLOLUCMGMBKAMGUEUJQNMJQ@EISBSCCSK@E@CFEFKBGAGECIEWEECAECCECG@]JMAACAEFMNUJARBNALMDAHDPQB@JHDBB@DEPCFCHPHDBABIHCLB@BGB@BLFJDD@PGF@FB@DATNRFLBNBDFBLGDAdLJFFJBBH@LEBEDODCHELCFCBIAK@CROHAJNRBDAFQFEZA^ORAHBRLF@BC@CAIDEJCD@DBBF@DBDPHDBFGFBDHDLDFTL@BEV@LDFTHDDAHCJGJWDOHMBGFEJIVCBMA_HIF@LRVPHAFIRCL@BRDD@DGBANADDJRFBFA\\SFBBBBJBBHHNRFLBBDBXEF@FBBD@LDDTLFB^E`ABHAnABMDK@KACB@HDXABKFGH@DJNBDCRBDDF@RBBJBDBBHOV@P@BD@FAVSPmDMDAB@BTJFT@VHJ@BKBAFANDNHF@HGJ@DDFLHdDFDDR@JBLDDBDHFFHNLDFFNGF@DBDNCHEF@HBFBBJCjGP@FEAGBIFCF@BBJJ`\\FTD@PAFKJBNCH@FBL\\BDD@dELAJENM^GJAHLBD@LELBFBBhKPAFDNJNEDBLHD@VWBB@BBTFNXJTEJFRJHAFCT@BBFPJFlAJEFGFAD@BBANCHKJGJALRBXJPVJfp|FDXFJHX@HFPNJF\\@LBJFFJNhDFHJLDZBDAJKDKPGZ@NAPEFIRK`MFSHKLMNAPEZMfEXIPJTAJ@JCPBPbJZEPOBCKSBWLGTEJAPJD@B@NI@CGICKBCP@AGDIEK@GDABIFIJKH@TDEL@DBBHCCEJ@BUFQJOBEEEFUEASBKAABEPC@ICGSQ]OWAGFAVFFCBMdB^MNJFJLJHFTHjOVD",
                    ],
                    encodeOffsets: [[112512, 38168]],
                },
                properties: {
                    cp: [109.49081, 36.596537],
                    name: "延安市",
                    childNum: 1,
                },
            },
            {
                id: "610700",
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [
                        [
                            "@@@IIABL",
                            "@@DIDG@GIMASJYJMFQIQBWEYJQPOEYOUB]JUBYMiPUTIrGTSVQj[RGNSF]EOOQKIAYCCOFKLUHOKYKGGVSCE@OGCAIO@CAMMIOECMCIGCBA@CCFGBEAAKAECGKGQBIFUDAHB@KBI[]KUBQACKFCAAEC@CABAFADELC@ACCACHIHABDB@RKBE@IEEDCLApW@CIGCEHID@BBBD@HLHFBJ@DBDHFIFAJBJSGISICMBMNYCWBSBQEgMQGYJk\\]LQHW\\[L[EOIKGOAUF]AOCUQWkcQGOQCWDYLMNKX]JeJWVOH@FGEKKCDGFEI@LMTDEKIK@EL@LHFFLBHIEKA@BEBCVDJADCJCL@F@LH\\KBCBMDELEFEJGFMBAHAFAHMLMCGBKGIMGAEBA`CVK@ECE@MBKDEAOJQAG@KFUHWAKKG]@KDMJKByNGAGBKACEDIHGN@NCTIzmVcB_LObYHILUEOCI[IKIY[oWSMGIUKQBGKNMAGKASBQLWL]DQ@UCKMFW^sF[ECI@WNG@EEAGBQJMJGNWDKL]FU`YNGPSJUHIJS@MKGOCOK@AEE@IGCEIISEEI@GAGBIAKJM@MDMLOFUGC@IFC@IEEMCEKACFC@ACAEGCC@IBGJGAGGQIBEHCDG@CKKCEFGCE@ABAHABIEEYSEGEOMKI@WACBQRIJQFCJSRKLMLKPEBEACDE@EJEBEFI@EDCFE@CDSWY@ECAFQRMFE@ABBJCDO@IHgnMbORGBEFOZIVELWXAJIL@LADKA[GOGO@GAQHCF@HADIHIXALDLALGLMLGXCBIAE@IDKHQREBCASM]BMAGBOJI@YKC@@CCBAAA@CAABE@@CCA@CAAFACAKCEBKCG@WIQIOAYHMLEHO`I\\GBACKDGIACOCEFA@AABA@AK@CJDB@BMDBLNHBJH@AFCDDJAFEJOF@D@DM@@ADA@CGHC@AH@FAFDDCBEAABAHDREPCFDJHJDHCNBL@DGBEDMDKBIDWDcBICCKIOGG@CCEOSiQmOWOCEA_WKCE@SCUOUGECGBGAKKGMD[NYJSJKJILUpGJGFCJULIBGDIBEEMDGAAD@BQAAB[HGFELKRSbEDGBKLGBILAF@JCDFFRNFNFR@JTzCPQf@LBPBF@LMXILUFGAGBGDGJARFTBNFLGFKBMCKDG@GCGBEBELEBM@IDG@GCQAGCEIE@kLMAG@I@AAEIICYAKAGEC@EBQT@NABMDCAOEIDG@IHMAUAMCCAEKCCGCK@IICAGBEBADIDQBKAGBCA@ICG@AAEECABEFBDCN@DBF@FCTHL@FGDUAkAKBQFGICGOAGCIEGGUOWGGIIGIKMGUEQBYKECEBY@QHMAQHEACAGIA@@CE@CCUE{GQCMAIGUGCIAGAE[@cDIDMNCBC@CYBO@AEAieKEYFECC@QHKJCH@JIDDPADQJSTUNGHCAUDY@gLEBA@KKEASAGCG@GBIHCFANGFCDAFABQCGBEFGAGCYBOJEA@CEAKDK@WCOFADBFAHCFCBIAUGINAJEFM@ED_EGBGDABCRGHUDKRCBEAEHQN@BJB@CDBHDJJDHAHKKICAAG@@F@BUAABBPDLDD\\DFLFDNADD@DBHEHFJ@DGJDPG@EDGAYA@DDBADSNIPMHEJ@BDDBDGJAFC@CADIKC@GAAA@QLGB@ABK@GAGAAICEE@GCIO@CAKAED@DQTG@WPE@IGIMIESKG@MGE@GHIDQBMBC@EFIDOGQAECEAIAGEGBAGEGECEBCDM@OJK@CQCG@ABGFG@AGIIOFGFaIFC@IAEEMS[KKGCBKXCHEBK@IEE@IHEAKIKQWJIBOGWYCAQBAECEGEEMA@Q@UMKBGEGMCCCAIBIAGICCM@IAU@MAGTANGL@JADA@MEWCEBIFEHAR@LBHDFTJBFCHADQDADCJDdCDC@ECGBGEGCC@EFIZDPDHBFIVEH@\\MHEPABMBMLILGXBLBF@XBBHDBF^PVBFCLQFCJARFLCN@FAVYFOFEPM`AVDL@LDT@NFJJFJHFHDL@XFH@dH\\BPAJBTBHDLBfVrRnX`VRA`MHAFEH@HDNLNTb`RVZVDHBJFH@\\NNCN@PCBGBKLEHDZBDDDP@FBBB@FFB@BKHELIHAHBNAHBDPLH@FAFDBH@DGFSAAHCFAHBDFFNJIJEBCAMEEGMEIBCDCFBHDFPNPFTPKNCHJJNFEF@JBHHDJCFEACFELC@C@ACAIB@AOK@EDAF@PDDA@CIKFCDE@OBAPGFGDAFBJJBFArBH@TAPCJEFMH_NWVEHGFGDUDiAGCgEOBUNINGFMF]@WFKFGFADAH@HDDAHCBIDcBQJIJKNCN@JDDLFBF@DDHAHSRIFMLsBFHFTHTBVKJ@HAb@V@REfEPBHARDDFBDLbDRCjAPELCXFLHLHJBFBHATDHNLHB\\RRRJPDTRHDDDPFJFDH@FAT@JD`\\R\\JFLRBF@HDHKLJBDCRBZAFAHINCNFPBBDH@B@@E@OFENAFHJDNPHBJAJAHEFANFJJHBNHHCHADAF@BCBATAHIFADATDDMIGIEUDACDEM[HGF@RBZBCPRDL@JF@AFA@ACCG@MGHGAM@ALCDIBAJBFAHAHGF@`IZDHDJLLFPB`Hb\\VVZRTHVBJDLAHAZULCHCHAXBPHJDPL\\ZPFP@LFL@H@VBH@RCJEDABCJeBUAKFY@sDIFEZSHATLJJFBPEBCB@BBBAFEBKDC@AFAFBDHD@NCJ@HADCD@DHJLDFJ@BDDFJZIhDP\\JN@@HID@DFHBDDBDKHEDAPAFDDJDBNHDDF@DAFFDLBNLXd`FHALEJ@HABEJFBH@FFNAN@FAD@XHJ@FFNHFAJHB@@DEHIHCFALEBGCGHGBE@CH@BFBJCT@X@HALBZGPAfKzSPGJFFDDN@DAFFTD\\@fBRBjB^AdBZDPBDHDHPBFADNGPAPEDRLPJFDF@JDJDFCD@JAJDDDDF@FCPSLEJCL@@CDCDABCEEAEJEH@RDF@XWFCF@FKbUJCt[fIFCNCZ@RDLFTP@H@NIDVDLDDLFN@DAHIBK@_BMDGJORQLAVDP@BAFKFELEHAFD@FNFH@DEIYDOIGAQ@EbbNQDADDJDFANQFGLEDEFQFICCDCPBdEPLNBFBBTLHPFJJNDRNPFDPDFNGR@NINJRVLD@FDLDBH@JKR@GWGEKCEG@MEGAOEGKBOIEQ@_DQTIGII[BCFEF@TS^M^CZ@ZGHILQHGT]LCd@^FdHXJRTbTJBH@`ERHH@LFRJPNDFHDJBVELAFAH@^NXP`DPEHIVKREJ@LHFCJFFFFTJLHD^FX@`OT@PCF@VHNAHER@XKJCD@RHLILIHCDEFCN@JDPGRJDJNXFDNDRZBF@FDLHBBFHDDAFKNEDC@CFAFCL@JCJH@HNBRLB@HGTMRBVEFAJ@RGF@BBD@NIPAPKZITC",
                        ],
                    ],
                    encodeOffsets: [
                        [
                            [108623, 33551],
                            [110648, 34519],
                        ],
                    ],
                },
                properties: {
                    cp: [107.028621, 33.077668],
                    name: "汉中市",
                    childNum: 2,
                },
            },
            {
                id: "610800",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@VBXDJ@DAHK@IGYAGDEFCFAHBDBBBBJFFXJH@FCHGAIYQCE@CFILOTM`KN@LB`@L@@CECGKGEKCGEEMMQEQAKDGHI@CCKGMSKDKSSOg[_Ui@GFEJGFG@GGOCMKWGGWIACAEDOAOCKKSmeMG]WIEQC[E[@]CUGaWYKaiCKBCHITIDCJYR[BG@gDMFKBKAKGKOKKEECAADIZ[BE@GAGGIQOO[@KISIOEEICOAGCEEAGBGJIFGBIGGEKY_OUKIKAIGKIEGCI@MDMFIBEAECEIGYMCGK_CIKM@OBGZ]BEACFMDCXGR@BICKQQAC@QDKBI@MCI@ICGIIKAQ@IBE@SK@A@OHOCeBIHU@EEEGCiUIAI@ULIHGBMDcBSGKGEIG]I]SUGMEUBMAECGGGGCWEeCKCIGcaQYMSOIQEYAFSAMEMMGOASBYKk@MBUCUCEMGKAgFQCMKGIGOAMAS@YBQDMTaBKAIekAI@OLUDM@K@KISCO@G@KFUHITGFCLSDG@ECEQWAI@KDIHKLGHC^QZG^CNINELGNSLafoJGDGFEAGBCHCX[ReB[JM^UYVEVIh]HIAKOQMQIGK@KFMLIjQLElERCLERQZSBGGOIEGCQ@OACCCGAIBEFKFGBEDSAY@GHIfkBGAGIIGKKGQIACDYAGKMKSCcDO@GAEGMGSCCGCIAcAICwEOCqAGAKCGECIEaO]AMAQBUHMNKVE`CN@PCZGJEDGAGCKIM_OAE@EDIVW@I@GCEICEAeBGECECKAQEMUQO]a]}OOYWoaGGCEAMDaCEGIEEgQQKOSEIUSS]MKICKA[BKAQEGGAGBENGhCFAFEBCAGCEMEQ@KD[VGDKBKB[AECECAEBIJOLIdKNOLUCAEIO@GBA@@GGEIAGCMBMDGGCICCBIACI@AJDFINBJMXQNID[Bg]UIO@OFGVALMHWFYXyP[DS@CAGKKUEGKEeIiMOEOAEFOLO@SFkvULOFSJIJC`BPSpMTCPCBHPBNLZFT@VCFGBKAECQMEAEKEACBU\\CPBFJRBVEJMLGJabBDJFRDJALIFKLCV@\\JFHBJ@LDJNRHZBZCNSJKBCFICEGC@ODK@GVGAGEICI@OFIJEDWHQDGDEHGdGLCBAA@WCCOIGGACHUHIGYMBAVAFEBAAEKIGEAC@CDEBSCiPSGGEKIEIMI]NcAANEDUEEBBHPXR^HTJDD@FOBALBTAFBEVFFAFIPERAVI@DFGDAA@CFKSCG@ILEJAJCB@HFLCJBHO@ADDLHJ@DMJA@C@OIIBSFKHAXLTADOPYFaIOOAIDI@SBOIWJeFYNOFMBKNGLET_NQLEJOFMBY@OHCLILCBYAKCKOMgEIIEKA[@IEOMGEW@IGWEECo{IeOUWIQABKHILIDGBMAAC@EBEHIFkBIEEOAAS@EDGBQIIESFWIEMAS@AAAUXC@KGCAMFMIECOBgLAAAEFK@KACGKIB]HMNIFKBcFC@ACK[EAG@MDIAELOBC@ES_[IIAAE@EDAJBHEFO@iHIDAAAE@GFEDGCMCAE@MHEEKCGMEECGCAKCIAQ@CCCEGcEKCCI@GHE@MGMCEBABALI@UGS@IEASA@CBCNOnUTEBC@@A@OPUAGCAIAAA@QCEACDQACIM@CHGLEBACW@GDALBL@NCBABmAG_B]FEASKCC@KACEAE@WFCAAAEKMQGGAAAIAAEA[TEBEAIQCCMBABCHC@QC@ADKJQBEOGQU@KJE`GNBDAJUFIHENAPGXCHIFM@CCCSGCE@KFQ@ESKCECKCGEAEHCAOGAC@CAECAC@IDCFBNCDC@QKSAEB]PYBEFERCBQAIMGBQP@DBLAJEDKDGFCDCPAFKFG@AAEIIEcKCBKHEAACAMEKMQBS@CEAE@OHC@ICKE@AHA@AKAGDAJABGCGOEDODCFA@CAIGA@ORGCCBKNMBQAIBEFGPENBFBDNB^IH@FDDDBFFDXFJFFDBHAHELEF@D@FTLDDATJT@FIRMNIRFVHVBNALHNDNKVKP[RKNGNAHEVBDNL@BCF_JSGEBQVGDkPADBBDDRHFBPCBDBNBBN@DBBV@FEDUJmdWHGXC\\@HALEPH^@VALKNOZIDG@CCAA@EFK@IACCA@CBK@AGCAIE@MNID[FS@CBABBFNXBFADQEAMKIUgCAKEIIMCGGEAqO[CWGGEcBKAEAg]@CHMLGLOFC\\GAGEKAEBEFETIFObIJCFI@CAQACA@MFC@@CDM@ECCEAEBEJABGAOE@INCD@@IAKCCKGESSCQKQMCQGGECEAIDGASQGAOBKBEL@PCNHVCFMDG@EAAICIGCK@KBEDCJCVQCJUAAMEG_AqEMU[MGSCE@CBGHCBGBSGMDCAGGGAKDKFUCSI{UAA@UAEA@EBIDE@ECKMAOAAEDC@CGE@AD@DCCCHA@@EGD@DMLAFGBMAOF@AAKCEC@ADMEGBBQGFIDCLDF@DEJ@FJ^APCPUh@RABQDB^InGXKPCBWGKH[AADBDBFHHDFALCDCD[@OFE@OMKQCAUBECOQQOCGCAI@E@@C@EJEBECY@CJ@BABCAEMESCEAKMBEPKPFFABA@CSaMBIAEHCDG@ECGFGABDCDCBDEAEBACGCBOMMDECIKAGDCB@DBDAFEHBFLD@NMDC@AEAIK@CBEJKAGfUDEBGMEEGKGMWCCQ@GBADBHABSLOBEAEA@C@ELMBIH@BACC@AH@DCBKAIFED@DCHA@EBIJSDACEFKNBATCFDNBBZAAUDGDAD@JF@RBFLDBA@GLEBCHEL@HGGGBEACBKKBCCE@@AC@BCACGFECCHE@CBBN@BECAECC@AB@BEG@CCI@BGAECFAEABETCFA@GKEQNMLCBCIOACNGFEJgPMFOAM@ODI@GGY@EJC@GIQeISGUOIIMIIAOIIAGEE@CCKCOAAA@ECJ]HUFGJEFMF]BOAYSS@IDObAFIFCFH@JLBHAHtSXUHYCeMSCMHKDcAFMFCFYTOJGAEAaUIAABATAFCBQDHDBD@@C@ABBDD@DJBBD@CFDFEDFDAB@FC@ABBBCDDBCB@AA@@FCB@BDB@FCB@DAAABBBABADCD@DBBCBAHBB@BEHDDA@AF@BF@CF@DB@BDEDBDCDBHCDBFADC@BD@DC@CD@BDBCDFDEDAHIFBBHAJR@HDBEFCNGFEFJH@FEH@FAB@DCDBJEBEHLCHBLEB@QPALHD@BC@GCGDDDLBALADCDABDDHBFEBBBAAADA@@BCDADE@ABCFCDBBCJELQJNAHH@@DBDD@FDFLDD@DLHADBFADHDCDFBADBBABDFEDHF@BA@AFFBCDBDAFCFBDCBBDEB@FCBBDEB@HCBAJABC@EDF@ADED@FIAEFQJ]VWNIH@F@DFDVDPHHATEF@BB@D@DABBDAFBDCBALCB@FAACFBDGFBBADEB@BCD@FCAAFIDADKFKJELK\\GX@HEJBLJPBJCXAD@NThFTRBRAn@TDHNN^JHDlZ\\VJLFTJHFLFTDTDFDPFJAHGJsMWFgt\\GHBDDfAPHHDHFCH@DRLDDpnFBhGDDB\\IByJI\\FLhDJAVMFAJ@nJJ@PDZRNNHPDNDXCZH^JLpN|Hh@ZNN@@F@BE@KAIFADBBLLD@FAAKDAJ@FBD@FIFCHMLCL@hhLTH^TrC^OLvVNZD@P@FEKKBGfKjeVKK\\IXAbIDBHF`CJCNK]@@LJL@XGRCAANC\\QO@CCg\\gAUBAX@HCJMDK@YBCNMDEEYS]@AR_FC~FJAXMJCIPELENMLGZ@NDVPLF\\AJBJHJNHPFF\\L`FXBxCZELGJQHMFETGfAJBNFNHJDJBPAFlFfLpVDVPAfOªyRCR@bHnNN\\VNHTBX@RARER@TDPLNX@PCRMhAlDL`hBPG^GTAX@H~DFPfJNDL@NIXMPcRBr@bORE`WXYBUTsJKfYBGFYDMJMPODAL@dRNBJBBBLZBHAVFHTJH@TEVJDBAHEPFFLJJNRrhBZ@BJixTXRrIRh±a`INANDJBHK^@DHFNDLHFLRTT\\@DIJUVBFBJRZHXNPNLf¢RH|fJHHLDFFZ@VCFKP@HDDVHJFFHPJRDFDXZRJNDRPftJF\\JVJDDJJJRPVBNDFPNLHZXRNhhXVXPL@LCrgbGDBJJRTdTJJ@DADMFQPIH_ZCDAFCNJT@PLVDFbJbHNDZ@JBLFDHHhBHLNzj@FAHDJNLdVZXNBBBXXLHJJHBHCTSjaH@NNZPHDFF^RFFPTFFHDDBF@LIFABFCF@BPPFLJJLLFLFL@FhJLPFAHGTLhIH]T@DNZfGHFTljBLP`^LPTRJFRD`XD@lnfPDBJLDJRNRD\\GRGHOJIz@FF[h]^ALTDNJPHHDDLTHNHFB^TFFBD@DIH[NIHUJQNOTEDUJICO@EDKJEHEP@BDBLGDB@LJPZHDFDDD@JCLOLGD@BCLEHG@EJCBEHCBGHIBEDADGHCNQD@BANAFBJ@PAJ@HCNDNCRJnFNFFFZFPHHDF@HCH@BBBJDDLHDDJDJHFBN@NBfVV@LDFFFBFFLDXFNLP@TBJEFBADGFGJG`EP@FGRQ^CREJINKTEBCFAHIPIHCBSAS@CBIPEVAPE^BBNHBJAJBDJFPFDFABNG®aJLL@\\MPQJGrDPABGYQMIFCVGHGPGHKLGBAAADABGRK@CF@JEFINGHGJCFGJCFGTEPKTEHCFCAEFABCFABGFILDTPZNDDFLFFLBDD@DEDSJHZRZBJJD^@\\GLCDCFIROVALBZRBDCJAJB@HBJADDDAPMLC@CJEbaDK@OBEDCNIFECCECCEFEBKLGLQJAFAHQDGJEJEJBDADCFEHEJA@ADABBH@@BD@HBDABBF@BDDABBH@DADDLBBBBADDFBRENIFAPJND@BBDFDRTPPBD@HBDPH@DCJBF@FEFDDD@LHAFBF@HCDDFAHHDADDHLLFHLH@BNHLTJFPBFFTV@JFHTBBF@FFLNHLHHBBDCDADNLLVLLBFADPJBD@FBBPNDLHJHDJ@HBFFNTFB^FTCJFL@RJRBJDPENHHDFF@DL@VNJL@FDDNDHFNAFBHF@BHD@JDBJ@BED@@B@DOF@DDBP@HCBGACBKDChHHCJ@RDPAHBRBTHNHBFBP^RFBFCDMDCXMAADIAAEABIEA@CHAEG@ECGI@@CDCDB@OG@@EEEFA@CCAEDEACC_SAGDIAAO@KEAECOEIRI@GGAEDE@GAMK@M@CCEOCEBIAGGQEBOISNIDC@GFGACEACEBIFGPBBD@BBDJDFFDBF@XO@ES]AEAGBGJMDCLMPGJ@RFFHBD",
                    ],
                    encodeOffsets: [[113793, 40312]],
                },
                properties: {
                    cp: [109.741193, 38.290162],
                    name: "榆林市",
                    childNum: 1,
                },
            },
            {
                id: "610900",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        "@@CEBGIKBULSLIJ@bDBV@TKfwFUBSI[MWUcQGOCIBCDS`UDSM[[KMGMKMMKMEiJOBKK@MNINEDCNBDABCFCDMLGAEIEMBAACCOICC@CBIGIEOICCGYaSUc[SI_AJoR_HaIOIGKLgDWIOMMq_KGEK@CFOL@QS]MMMYCYEBOFSJMLGL@JBLHdVFX@TIRSRWBKGaNGPAR@TH^RLBq\\MTCJKFQNSNKXGHKLADEDGAGHAJANGDKLCBGHCNO@ECIRCFKJCFKHFJBTAJQBKHCDCBCCIB@JFF@FDFEJCNDBDBHRDDDH@AHBBANBHCJAFNVNBJJD@FCBERGD@HFLDJJFDPNZbJLXJJALEJUJI^YPIPQ\\QXAF@H@TDPAFBFAL@DDRZFEBBDFB@FED@FFNFHHHBB@@JEBPJP@LALIZaPGrLZBdMPMLUNQLIPCNDhVPDBnDFCJAHEdKzBLAX@PCpS^EJELQLGFBDHJFLDFCDMJEXBZNNDp@TElDNETWVEVKTGVKJ@TGNIfIJ@FEBQIgCcAiE]SsCO@aKWE]JEHEPUFELOTIL@FDRNLFXF\\BFJLZDDJBLADCZQH@NDZ@LCJEFELQHCHBLA^DdE`DD@DCJMNGVEXDH@BCBCHO^QtKrWRIHGHKDMHGLCXDAEDEEIOSEKAIFKRMN@NHH@FCJa@gCQ@KMeAODMPKRSLGFQLQ`SFECKGE_MQSISKGWAMJ[\\QJUDW@WCIGAOHIBOAMGISGKIMKUMoUSAW@UFOLalSFMGS@iX[HYBaAYC]DmNqHeTSPK@KBKAWGÇGMEIGGWH[\\_HUOSWM}QQKEG@]KMGGYGIOA]KUUKGIFwGK]AIGGKCUBMHSLUDQ@SEOWcEMDIJKPGRKTSTaN]FGDSXELBLDfKJMNM@K[sEYDWFULQJKNEX]BGEMCUEI]cQ_EWAUHYT]XORYHGFIFK@WAMCKOSIAkGGYIS@IDGPEJAHEHGNYDQFM\\yJ[CGCEKDQBIASCEGIIIMCM@GH]CUHELAFEBCCAUIOUKDOEG@IBOHC@EAMEWGKBUGOACCCAYJMAM@CA@GCA[BELCDUAGCMBMCGBC@ECCE@ICCcAMCO@iFOAeBDMBSLG@CPF^@HEDMDCDDD@FCD_FCBAJDDNBDJZFLDEDGTBTCD_FEAQJMFGAGAeRc@CBADALNZBF@DCDG@CDAF@Jg^GJQHQHWLIDK@GDGLQTOJKHKJGJMLULODEBifECIBSHONM@MDYPG@ICUJIAIEG@WPIDUAU@G@OEaNEDAHSFGDGLEDCHCBKNCF@F[VUFMDIFGBmBMJKDOVIBKHIFALBNCFBHAFEHQJIDO@YEWBOC[@K@EDINGBOHAD@HIFCFWJCBILQJEHIDIHG@IFGBABGNGJGBaDKFOAQDGHGHOJEDEDIHKDEHAHBHNL@BCH@RELCPIDQCQJCFBLADKLIHEAEICAKAOGMDM@EDYECAIMEDSNMDE@IAIKK@KEkBCAEIECEEEMGGC@G@ODKEIFKDINQLCBI@OHOFEFGNMLGDK@EAEGIEAA@E@AIAGEC@EBEAAABIAIGI]OAGBIIEGCKBKTEBIBQJ@JFF@BPLPDLH@NITGJIVOTMH_ZEVK^CLMXIHINARBHFFH@XMJ@FDE\\]tEXLNVDR@^CXKRKTALBBHMNHLRAVLHJTNpXZ\\LJ\\JDJFPKVGJaZKPA`UdynSJMDM@GHCJDFLBHAHBzMLANILC^@LHBLGXEV@LBHIRBPCFAL@NDF@FUL_DABBFNHHJALDHKNGNEBGBABENIHEFKFCFANAD[LKGE@K@IDCDIBUCADAFB@FLGJKAEEKGK@@FJLFLSCKNJ@EFCHLDFLEHG@UPIXIfW^MLKNCZDXPRRHldRXDVBPE^BVHPJLFPK\\[\\GXKR[^IlHZNRFhARATDXMZANDNTJHJITIAEBEJCGCAI@EAKG@GACAAC@GJDFJH@DoXKBCDFF@JAFQLA@ACGBGJBDDD@BKDCFEBABDBD@BFDBLEBDARLV\\^AJ@LGACBEVAJHRHLFDLBBBAFEHDDB@DAJHNDFDJPNNDBP@BJHD@PDFUTHHZLPLVGLKPEDDBZLJPRFPE^MTQHi\\URSTqHSJOVNjAZIVA^PVFZOPIRFZAXJRERINIZBTJN@HCHCJF@FBDDDFTPRD`CNILEFEH@NNF@JFLGPEFEJBDBDBLERDPENFBB@HDDBBBFBBD@HCHCJ@FAFDJLRCF@F@F@HDDHRTFHHDBDADDDTFXLDFFBF@fGHBDDVJHJBHDDPFLBBBAHDFXCXDDAFEBMDC^EBA@GRMBCDAL@BBFNB@HBbNPFNRHBXRPAJDLFH@JGjKHAJBJEN@FCNADMDEJCJSDCV@JADBNAJHBDADCHCHFBPPDBFBDBFPAFBDDDBFDBFBFD@DCN@FFBhLNFLNB@LGN@XEVDNAFA@IDALAH@HFP@JHJBVLB@JELBJ@BABE@EAIGM@EBCDEFEhW@HHJHDLCD@LJJD@DBBB@JGB@B@HHNDHDD@JGF@",
                    ],
                    encodeOffsets: [[111453, 34628]],
                },
                properties: {
                    cp: [109.029273, 32.6903],
                    name: "安康市",
                    childNum: 1,
                },
            },
            {
                id: "611000",
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [
                        [
                            "@@EICGAAICIMIICAQCOBIECWLEDCBMNMBC@AIO@ADCLCRA\\EHEdEJGNINKDAF@RHVEP@HCJADCDIBKACFGBCL@JENB^CBAEM@GRBPEH@\\BHIREDAHKDCAICIIKSMBCFE@AACIIGAIUQIOEEAEEAIFODa@OAAABABCGCA@CDA@EIEJA@EEADEOCDALC@AASCGDCHBH@`@HD@FCFDFHBJCDGJI@AEAAEFEHAFG@EBEX[BYAQHCfE@C@GBIHI@AKQCCGA]AUIMKIACAEIHKBEACKAU@SGSGACCMAE@CTMDGBGZE@MAOBERCHAFEJFF@REJBRLHBJ@HKNCNMNALATAHABALUJGBCDQ`SNAJDNEJARDPADKDCAKHIDARABEFMHQRGBC@[BGHMJOJEBCAEGGBKKQ@EFKJEFEBKHKJG^IjoLAXBHANKH@~OPOHGNDNAPKLMZQFGPIJYDKACKS@EBGCKBEZOFGPkBMA[IECDCABMBABDLGKakUEGPaDEJQ@QBIJQLIFIBSGU@KFIHI@EGKUIWAEAEIDKJEF@BMGCK@CEBO@EEIGC@ABGAAMEACPQLMCGGHGBWDQAKEGESOUCKB_N_DCAGKECQBKEGBOCSUG]FMBGHMEIEEGBEFALC@KIGIGCGBQBaBYEOEcYKQGQ@MDK@IQEQBa^]`KTEPIRMHKEYQQCMDQHMJKPALDN@PATA^GNKV@NEXGNKFOBoBMEIKBKCUIEMGMCIIIGMUC@ACCBBCEBBCCA@BEBBKACABEAAGCBGE@EEABAD@@AB@ACBEC@DAACGBCBIBCDOF]GQII@eLG@CBAEAFCEADACADCABDSBGCE@CHHA@BABFB@DABEC@BCFAAAGEBIAIMECICOB@CE@BAEBBCF@BAAAC@GEF@BCAAGAKFcHEDUDUBkI[KeCQDIFQRINKFKFCAABCBCEED@FA@FDKL@DIJSNkEYI_DWBsE[EWIWESBYPCJGHKFMBaMQCKBQHSJ_NIJYJRULWFMAS]CWAoD}I]FaPQZaDOEQIM@EF@TCNWPaAEAEGIECEAMBkKE[EODWJUHODWBWCWGMOCYMSUEKGISISOOUO][mCAOCgUMCODKJMRKVONcNYAqKOHYbKJKBO@OIFA@IA@GAGGMEEEC@EFA@CEAAEFQYCCK@EBEAOBSCG@E@WB[ROROJ]ZIJIVKFIBWIIKYaOMECIIKCGEC@QHAFEDC@IIMAMUBEDIAGBMAABGG@CCQCAGACMCIDEFECE@IEA@DJADCDGDALIRSBIAGEELIDELQDDJ@FMPGDAHKDCLMHIBGBBHCHCFKBGLWHMLMTERILSD[NrKA]QSGQ@OBMHHbALQXQTSJW@UEcKGIAK@KHINETAPFDZNZNNT^@RKEP@DFLLHr`NNJPCXKhHLPJbJ`GpQI`BTJd\\TVZbDHJDFPHJAJ@DDDPJDDBBNAJFBFKHCNEDADCBMACDMFMJ@NLLPAjINFNLLNHNLN\\\\TNVCT_DCJAPDRHVdNXJ\\ATEVexSLU@AaCI@KJKTAVJLAHBDBBFADLLDDHTEDCPDHFHDHHFBH@FDJDBHL@PPBJ@H@JFJBBHBFCNCF@HBJ@\\JNJF@FAPALDL@FJHDX@JFJLRHFHLJNXBHDDHBD@FGRAHGAIJE\\HD@RGPDF@DAHILE@gFGFADDL@NGFAD@FHJAJÃECCEBAIKJGDGNDLHBJNN@DC@f¼FEJAVAP@DBLNNHF@TCLHF@\\I^APGDGDINILBFCPALFHDBBFFRCJHP@HDJCJKZM`@DKFCv@JCVBDAJIB@FDBDFFLADBBHLFJ@REXANBLAHNDBTDXFFFDXBBJ@HDTPBHDDJ@DBFFFD^AF@BBJ`CX@FJHDJ@HEFQBMJEHgN]VQHGFCFBFJLEH@DHFFVDJ@XDBTHHFAFML@D@HDFNFFDDPRDJJHBDTDBPDDHFJ@NFHLDHAFBDHENEF@XHRHFDFHFCDKDCPDF@ZSF@LBFD@HDLANBNFFTDHFTVHPRXPBLC@AGECEAGDGVHFJJCHGF@FDFD@HSVC@OIEAIJEJIFEJKJKBIDSCIFI@CBBFPPLNBHADKBOjGJABTLDLHF^@HA\\kRKHAINDJ@FI^CZ@BPHVDFNDFTLD@F@JINGHKNIBGTHTDFADIFGHK@ECE@CFGLCZAHEHAFGJELHVBTNJDJ@CIDICKGEAKNMHCHAFBNBTHNNJAD@FFFJJDJHNGDLFFMFCDADFR@LEXILADBX@FEL@DBFHDPIVAD@FHHBBD@\\@BKFEPADMFIZEDQ^JHNFHFH@NAJBV^RHBHBXBBJBTATNH@FB\\RV@dEFBLHTATBBAHETCDG^O\\CRDdOPATB`KTMPERD^@XNLGNALDN@JDJAZBTALHDHHDJDN@dEJ@PFZIZEVPL@FABAEW@GFIBMHGFOBEBOFETIDCBEBO@EEMBIACCAW@E@QHCE@E",
                            "@@e»]DCCIÄLBHIDAHBNFJCPDJE",
                            "@@@S@CKHDHAB",
                        ],
                    ],
                    encodeOffsets: [
                        [
                            [113124, 35140],
                            [111812, 34685],
                            [113692, 34283],
                        ],
                    ],
                },
                properties: {
                    cp: [109.939776, 33.868319],
                    name: "商洛市",
                    childNum: 3,
                },
            },
        ],
        UTF8Encoding: true,
    });
});
