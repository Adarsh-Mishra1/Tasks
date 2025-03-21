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
    echarts.registerMap("china-contour", {
        type: "FeatureCollection",
        features: [
            {
                id: "100000",
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [
                        [
                            "@@¦ŜiÀºƦƞòïè§ŞCêɕrŧůÇąĻõ·ĉ³œ̅ó­@ċȧŧĥĽʉ­ƅſȓÒË¦ŝE}ºƑ[ÍĜȋ AɞÏĤ¨êƺ\\Ɔ¸ĠĎvʄȀÐ¾jNðĒĞȠzÐŘÎ°H¨ȔBĠ ",
                            "@@ƛĴÕƊÉɼģºðʀI̠ÔĚäθؾǊŨxĚĮǂƺòƌĪŐĮXŦţƸZûÐƕƑʳÛǅƝɉlÝƯֹÅŃ^Ó·śŃǋƏďíåɛGɉ¿@ăƑ¥ĘWǬÏĶŁâ",
                            "@@ěđcĳ«½émă©HĕoƫŇqr³Ãg[šÃSő_±ÅFC¥Pq{ñg¿įXƗķęǋûěŉ³F¦oĵhÕP{¯~TÍl¸ÓßYÏàs{ÃVUgĐuk±ŉVÓ½ŽJšć»Dw´fĎdF~ĀeĖO² ĈżĀiÂd^~ăÔH¦\\§|ĄVez¤NPǹÍRÆƇP[¦´Âghwm}ÐÐ¨źhI|VV|p[¦À¶èNä¶ÒCÀ¢^hPfvƾĪ×òúNZÞÒKxpw|ÊEZÂI¨®œİFÜçmĩWĪñtÞĵÇñZ«uD±|ƏlǗw§ßÍaB× CLǑkùŧı«QaċÏµřѥŗ³ÃARZRlʑýSëÍDěïÿȧ¢ÙĹȷț£YªhVƱ£ȍTu¼šñ¯ÿ²UºÝUąŻƦùaŗōZġk©ïƯG½lʁƜƕ¬WfĞÑò_S̄±ÀbÎÉnb²ĦhņBĖįĦåXćì@L¯´ywƕCéÃµėƩìĝĨ_j|BíÂKTɢAt{ƪ|ŴŚ¥ĠʦĘĒØ¼Â±ŴPè¸ŔLƔÜƺ_TüÃĤBBċÈöA´faM¨{«MúīôÖ°ʊkŲÆM|²@¤u¤Û´ä«̰\\}ēÅM¼Ã­]NągoõľHyGă{{çrnÓEƕZGª¹Fj¢ÿ©}ÌC̍ƃhÛ­Å\\bÅxì²ƝýNīCȽĿǃŖÕy\\¹kxRmìáKµË¤ÁçFQ¡KtŵΥëÚź«ėn½ĉŀÁ¼zK¶G­Y§Ë@´śÇµƕñxZ¯uÏï{éƵP_K«pÛÙiŷčaBuuj¹ñUšŐÚb¤uŃJŴu»¹İ×ȖħŴw̌ŵ²ǹǠ͛hĭłƕrçü±XƳ¾Ï@ăÀƩÇq^ùzWmOМƛÌ˃ʊáĘĳĘȃXɉŭ}ͳƀI©Õ͈ǫȌȥ¦ŋEÓıŀçokÿ¸åżȟLƏŽąđGǛģǈƧȐĝȶʋÀBŖÕªÁŐTőŕËCĕģi¨hÜ·ñt»¹ýv_[«²K{J­U¨}EÉµ¸gÑpY´«ęƘʑcoċ\\cįŧ«Āý¶ŧ·ÅKsËÅg¤Ù\\ĭƛëbf¹­ĥWĠkáƉÔ­ĈZ~ïµfzŉfÓÔȯȉÕĕÊĉ{ğč±uƁí]Í»ęX\\­Ip¡éĥZEãoTüq¸k³¡ƽ¿å³BRØ¶Wlâþäą`]aģc ĹGµ¶HåÕ¾xĨôȉðX«½đCIŇOK³ÁÄţ¬OAwã»aLŉËĥW[ÂGIÂNrį~IÔ¤âĘÎQÀucoÄMÝF{¢[MyùaHÝh¨Áeuw¢BI¿]zG¹gqĬuë±KEò§Zì÷tMāe£bYÂý¡a±Öcp©®^ö±qÇGjųªKy¬ŏ®¤ÉEĀåA¬V{XģĐËknę¼³Ār¹ġsÐ«ĽPĻÅ§qlÀhH¨O¿ĉÇGAa·āIÂÿągĕeûÒ{[ÓŵS[¡Uāő·ùěYÓ±]ÓđīkWó«íěCŇͳčvĭõĉę÷N¹³ĉoTĵËçŁYÙǝŕ¹tȏģ·Ĕĭ|đėÊK¯Nē ó]ĀęAx»HO£|ām¡diď×YïYWªŉOeÚtĐ«zđ¹TāúEáÎËķÍĊÙÆſ¿Çdğ·ùTßÇţʄ¡XgWÀǇƟĻĒfÇ÷Sğ³kzőȝğ§õ¡VÙæÅöMÌ³¹pÁaËýý©D©ÜJŹƕģGą¤{ÙūÇO²«BƱéAÒƇ×«BhlmtÃPµyÓɉUīí}GBȅŹãĻFŷŽǩoo¿ē±ß}wƋtƺCőâUØȵğŉąǋÅñIÃ[Ę±ÌÜÓĨ£L÷ʂZǾĆĖMĸĤfÜǗjđĆ»ýͥãğ¶ĞØO¤Ǜn³ő}ięšőűMę§ZĨíÛ]éÛUćİȹ¯dy¹TcÂĕ½A´µê÷wĻþÙ`K¦¢ÍeĥR¡ãĈu¼dltU¶¶ď\\z}Æ°Ŭ{ÚfK¶Ð_ÂÒ¿C©ÖTmu¼ãlŇÕVåĤĵfÝYYįkÒīØſNQĠ³r³øÓrÖÍ³gÍſGįÅ_±he¡ÅM²Ɠï¥ßīZgmkǭƁć¦UĔť×ëǟe˭ʔħǛāĘPªĳ¶Ņăw§nď£S»şÍļɉŀ}ÛÞ»å£_ıęÏZ÷`[ùx½}ÑRHYėĺďsÍné½Ya¤Ïm¬ĝgĂsAØÅwďõ¤q}«Dx¿}Uũlê@HÅ­F¨ÇoJ´Ónȯ×Ã¢pÒÅØ Têa²ËXcÌlLìģËŁkŻƑŷÉăP¹æƧÝ¡¦}veèÆ´UvÅ~§½Ġ²Ŵwæč\\D}O÷£[ăá[įŷvRsdĒƄwŎĒo~t¾ÍŶÒtD¦Úiôöz«Ųƭ¸Û±¯ÿm·zR¦Ɵ`ªŊÃh¢rOÔ´£Ym¼èêf¯ŪĽnAĦw\\ưĆ ¦gʉË£¢ιǫßKÙIįóVesbaĕ ǠƺpªqÂďE®tôřkȌwêżĔÂenËÂQƞ´¼ŲĘ¯Îô¶RäQ^Øu¬°_Èôc´¹ò¨PÎ¢hlĎ¦´ĦÂ¬oêÇŲÚr^¯°^º{ªBH²Ö¤ɦ§Țvqĸ ­viļndĜ­ĆfŒxÝgyÞqóSį¯³X_ĞçêtrmÚ§z¦c¦¥jnŞi¯´ÓH@ÂċĂį·Ì_þ·¹_wzË£Z­¹|ÅWM|O¥ÃWTÕ­ùÔQ¥¥Rã»GeeƃīQ}J[ÒK¬Ə|oėjġĠÑN¡ð¯EBčnkòəėª²œm˽ŏġǝʅįĭạ̃ūȹ]ΓͧŹəăЕ·ƭęgſ¶ҍć`ĘąŌJÞä¤rÅň¥ÖƝ^ęuůÞiĊÄÀ\\Æs¦ÓRäřÌkÄŷ¶½÷ùCMÝÛĥ°G¬ĩ`£Øąğ¯ß§aëbéüÑOčk£ÍI ïCċÀÕÕĻSŧŉïŽŗãWÑăû··Qòı}¯ãIéÕÂZ¨īès¶ZÈsæĔƦÚ@îá¾ó@ÙwU±ÉTå»£TđWxĉWù×¯cĩvėŧ³BM|¹kªħ¥TzNYnÝßpęrñĠĉRÑÈěVVµõ«¯ůĉ¥áºaeõ|uĐh`Ü³ç@ƋĿa©|z²Ý¼Ĵč²ŸIûI āóK¥}rÝ_Á´éMaňæêSĈ½½KÙóĿeƃÆB·¬ƃV×ĴƳlŒµ`bÔ¨ÐÓ@s¬ƿûws¡åQÑßÁ`ŋĴ{ĪTÚÅTSÄį¤Ç[Ç¾µMW¢ĭiÕØ¿@ÂpÕ]jéò¿OƇĆƇpêĉâlØwěsǩĵ¸cbU¹ř¨^±zeė·¥Ó@~¯éīB\\āƚǗÀƷŘóQīÈáPǥ@ŗĸIæÅhnszÁCËìñÏ·ąĚÝUm®ó­L·ăUÈíoù´Êj°ŁŤ_uµ^°ìÇÊĶĒ¡ÆMğźİĨƥôRāð©[wâäĄ©Ô\\°ÝĄ̄ƢăknéǀůĆKĒĬ¶èâz¨u¦¥L~ƄýÎIƖßµĔƱĐċņbÎÕĄæ_ƞZRÖíJ²öLĸÒcºƖÎ\\ñºÛqYŃ¨`x¥ù^}ÌđYªƅAÐ¹n~ź¯f¤áÀzgÇDIÔ´Aňńňĕuĩt[{ù°ŁÏ|Soċxţ[õÔĥkŋÞŭZËºóYËüċrw ÞkrťË¿XGǣ@Dü·Ē÷AÃª[ÄäIÂ®BÕĐÞ_¢āĠpÛÄȉĖġDKÕKÄNôfƫVó¼ǳHQµâFù­Âœ³¦{YÂ¢ĚÜO {Ö¦ÞÍ¨JÜÄƨlUĔ§ªÍEË¨¡ĐĬĬùÎRƠHÕŔ_ƪàÒKäȇĬə²ȕnáûl÷eǛòĞ\\ªÑòÜìc\\üqÕ[ēǆċªbØ­ø|¶ȴZdÆÂońéGŠǚnìÈƲŪȖưòTxÊǪMīĞÖŲÃɎO̚ǰRěò¿ġ~åŊú¬ô¸qĘ[Ĕ¶ÂćnÒPĒÜvúĀÊbÖ{Äî¸~Ŕünp¤ŀ¤ĄYÒ©ÊfºmÔȈ¡Ǆ~¤s²ʘÚžȂVƼîèW²æĲXŔþɔÖĚêϜêĮŢɨJ¯ÎrDDĤ`Q¾§~wâJÂ«lµĂÆÆŌŰNǎÀW|ų ¿¾ɄĦƐMTwŊ÷fØĶK¢ȝ˔Óɖ­`Ɩ½ǒÂň×äı§ĤƝ§¥ÀhlåǺŦŞkâÌwøàĲaĞfƠ¥Ŕd®UɎÖ¢aƆúŪtŠųƠjdƺƺÅìnŢ¯äɝĦ]èpĄ¦´LƞĬ´ƤǬ˼Ēɸ¤rºǼìĴPðŀbþ¹ļD¢¹\\ĜÑ̔ùўÊȮǪűÀêZǚŐ¤qȂ\\L¢ŌİfÆs|zºeªÙæãѢ´ƐÚ¬¨Ĵà²μ\\ÞºĠUƢ¾ªì°`öøu®Ì¼ãÐUÞĖ¶X¨¤ɂhʐßØvKˆ~Ã·àÏŵ­_«EÍɪëÏ÷ÅyXo͂ĝĂÛÎf`Þ¹ÂÿÐGĮÕĞXŪōŸMźÈƺQèĽôe|¿ƸJR¤ĘETėº¯ɀáMĺŝOéÈ¿ÖğǤǷŔ²å]­Ĥĝœ¦EP}ûƥé¿İƷTėƫœŕƅƱB»Đ±řü]µȺrĦáŖuÒª«ĲπdƺÏɌ]͚ĐǂZɔ¹ÚZצʥĪï|ÇĦMŔ»İĝǈì¥Βba­¯¥Ǖǚk˦ӷxūД̵nơԆ|ǄࡰţાíϲäʮW¬®ҌeרūȠkɬɻ̼ãɜRצɩςåȈHϚÎKǳͲOðÏȆƘ¼CϚǚ࢚˼ФÔ¤ƌĞ̪Qʤ´ԜÃƲÀɠmɆǄĜƠ´ǠNˠŜ¶ƌĆĘźʆȬμƒĞGȖƴƀj`ĢçĶȅŚēĢĖćYÀŎüôQÐ¨ĢŸǲȨĸΪ_ƞŧǘÛۨĝȘĲªǬ¾äʀƪ¼ÐĔǎ¨Ȕ»͠^ˮÊ˰ȎŜHĦðDÄ|ø˂˜ƮÐ¬ҌqjĔ²Äw°ǆdĞéĸdîàŎjɒĚŌŜWÈ|Ŗ¶îÎFCĊZĀēƄNĤ¶łKĊOjĚj´ĜYp{¦SĚÍ\\T×ªV÷Šų¬K°ȧļ¨ǵÂcḷ̌ĚǣȄɧ\\ĵŇȣFέ̿ʏƶɷØ̫»ƽū¹Ʊő̝Ȩ§ȞʘĖiɜɶʦ}¨֪ࠜ̀ƇǬ¹ǨE˦ĥªÔǲl¶øZh¤Ɛ E ĈDJì¸̚¸ƎGú´P¬WÄìHsĲ¾wLVnƽCw`h`¥V¦U¤¸}¾Ô[~âxh¢ªHÆÂriĐɘǜhÀoRzNyÀDs~bcfÌ`L¾n|¾T°c¨È¢aÈÄ[|òDȎŸÖdHƮÀì~Æâ¦^¢ķ¶eÐÚEêɡČÅyġLûŇV®ÄÈɎöƂŤǒČ¦ÒŬÂezÂvǴZ{ĘFĒĴAΜĐȄEÔ¤ØQĄĄ»ΈZǺ¨ìSŖÆƬyQv`c]Ì®ü±Ǆ]ȘŏńzƺŷɄeeOĨSfm Ɋ̎ēz©ĊÄÕÊmgÇsJ¥ƔŊśæÎÑqv¿íUOµªÂnĦÁ_½ä@êíuáĠ[ġ¥gɊ×ûÏWXáǠǱÌsNÍ½ƎÁ§čŐAēeL³àydl¦ĘVçŁpśȄŽüĿÆMëØé×ğÒyąÈ¥Ǥ§YßċġHµ ¡EŃļrĉŘóƢFƺ«øxÊkƈdƬÌr|©ÛńRŀøďŊŀàŀU²ŕƀBQ£Ď}L¹Îk@©ĈuǰųǨÚ§ƈnTËÇéƟÊcfčŤ^gēĊĕƯǏx³ǔķÐċJāwİ_ĸȀ^ôWr­°oü¬Ɍ~ȰCĐ´Ƕ£fNÎèâ_ÐŮeʆǊǘuȔ\\¤ÒĨA¢Ê͠æÔ ŬGƠƦYêŊàƺMk¥ͥœ@čŅĻA¶çÎqC½Ĉ»NăëKďÍQɅřęgßÔÇOÝáWáħ£˯ā¡ÑķĎÛå¯°WKÉ±_d_}}vyõu¬ïÏŅ½@gÏ¿rÃ½±Cdµ°MFYxw¿CG£ǧ«»ó¡Ɵ¿BÇƻğëܭǊĭôµ}čÓpg±ǫŋRwŕnéÑƕfSŋ®ÍD Ûǖ֍]gr¡µŷzįm³~S«þeo³l{iē¥yZ÷īĹõġMRÇģZmÃ|¡ģTɟĳÂÂ`ÀçmFK¥æåÍZX³ÌQÒHof{]ept·GŋĜTǊųVx¶ydõkÅZW«Whw·S^sEçǑ}~uLģĻhtW·Ýďæßa}xVXRãQ`­©GY»Ã{ɃĭcÏYƅ»é\\ɹ~ɍuØ©Bš¤ÝĤ½¢ÃğǉýqT^rÇIs®y}ywdSǱt@mÿvaʅFjƭâ¦³PrbbÍzwBGĭZÅi»lY­ċ²zÇ£^§»d¯íŷ§ćGŻǉƇÏ]íM^o£Ã]ªUóo½~½»uåÁ¤ċh¹·CÉ­DŉrwǹÏģS}xƃği©ěƟĿ",
                        ],
                    ],
                    encodeOffsets: [
                        [
                            [112750, 20508],
                            [123335, 22980],
                            [127432, 41128],
                        ],
                    ],
                },
                properties: {
                    cp: [116.3683244, 39.915085],
                    name: "中华人民共和国",
                    childNum: 3,
                },
            },
        ],
        UTF8Encoding: true,
    });
});
