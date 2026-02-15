(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/services/mappack.service.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "mappackService": ()=>mappackService
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_BASE = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const mappackService = {
    getMappack: async (mappackId, playerId)=>{
        const url = playerId ? "".concat(API_BASE, "/mappacks/").concat(mappackId, "?player_id=").concat(playerId) : "".concat(API_BASE, "/mappacks/").concat(mappackId);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(url);
        return response.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/mappack.utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "groupTracksByTier": ()=>groupTracksByTier,
    "sortTiersByPoints": ()=>sortTiersByPoints
});
function groupTracksByTier(tracks) {
    return tracks.reduce((acc, mappackTrack)=>{
        var _mappackTrack_tier;
        const tierName = ((_mappackTrack_tier = mappackTrack.tier) === null || _mappackTrack_tier === void 0 ? void 0 : _mappackTrack_tier.name) || "Unranked";
        if (!acc[tierName]) {
            acc[tierName] = {
                tier: mappackTrack.tier,
                tracks: []
            };
        }
        acc[tierName].tracks.push(mappackTrack);
        return acc;
    }, {});
}
function sortTiersByPoints(tracksByTier) {
    return Object.keys(tracksByTier).sort((a, b)=>{
        var _tracksByTier_a_tier, _tracksByTier_b_tier;
        const pointsA = ((_tracksByTier_a_tier = tracksByTier[a].tier) === null || _tracksByTier_a_tier === void 0 ? void 0 : _tracksByTier_a_tier.points) || 0;
        const pointsB = ((_tracksByTier_b_tier = tracksByTier[b].tier) === null || _tracksByTier_b_tier === void 0 ? void 0 : _tracksByTier_b_tier.points) || 0;
        return pointsA - pointsB;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/useTierScroll.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useTierScroll": ()=>useTierScroll
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useTierScroll(tracksByTier) {
    _s();
    const [activeTier, setActiveTier] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const tierRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTierScroll.useEffect": ()=>{
            const observer = new IntersectionObserver({
                "useTierScroll.useEffect": (entries)=>{
                    entries.forEach({
                        "useTierScroll.useEffect": (entry)=>{
                            if (entry.isIntersecting) {
                                setActiveTier(entry.target.getAttribute("data-tier") || "");
                            }
                        }
                    }["useTierScroll.useEffect"]);
                }
            }["useTierScroll.useEffect"], {
                threshold: 0.5,
                rootMargin: "-20% 0px -20% 0px"
            });
            Object.values(tierRefs.current).forEach({
                "useTierScroll.useEffect": (ref)=>{
                    if (ref) observer.observe(ref);
                }
            }["useTierScroll.useEffect"]);
            return ({
                "useTierScroll.useEffect": ()=>observer.disconnect()
            })["useTierScroll.useEffect"];
        }
    }["useTierScroll.useEffect"], [
        tracksByTier
    ]);
    const scrollToTier = (tier)=>{
        var _tierRefs_current_tier;
        (_tierRefs_current_tier = tierRefs.current[tier]) === null || _tierRefs_current_tier === void 0 ? void 0 : _tierRefs_current_tier.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };
    return {
        activeTier,
        tierRefs,
        scrollToTier
    };
}
_s(useTierScroll, "s6/9k3IW9zYIoUW8RUJOKCjiBQI=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/time.utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "calculateTimeDelta": ()=>calculateTimeDelta,
    "formatSecondsToMMSS": ()=>formatSecondsToMMSS,
    "millisecondsToTimeString": ()=>millisecondsToTimeString,
    "timeStringToMilliseconds": ()=>timeStringToMilliseconds
});
const millisecondsToTimeString = (ms)=>{
    if (!ms || ms === 0) return "";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    return "".concat(minutes, ":").concat(seconds.toString().padStart(2, "0"), ":").concat(milliseconds.toString().padStart(3, "0"));
};
const timeStringToMilliseconds = (timeString)=>{
    if (!timeString || timeString.trim() === "") return 0;
    try {
        const parts = timeString.split(":");
        if (parts.length !== 3) return 0;
        const minutes = parseInt(parts[0]) || 0;
        const seconds = parseInt(parts[1]) || 0;
        const milliseconds = parseInt(parts[2]) || 0;
        return minutes * 60 * 1000 + seconds * 1000 + milliseconds;
    } catch (error) {
        console.error("Error parsing time string:", timeString, error);
        return 0;
    }
};
function calculateTimeDelta(personalBest, goalTime) {
    const delta = personalBest - goalTime;
    const isAchieved = delta <= 0;
    const absDelta = Math.abs(delta);
    const totalSeconds = Math.floor(absDelta / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = absDelta % 1000;
    const sign = isAchieved ? '-' : '+';
    const formatted = "".concat(sign).concat(minutes, ":").concat(seconds.toString().padStart(2, '0'), ":").concat(milliseconds.toString().padStart(3, '0'));
    return {
        delta,
        isAchieved,
        formatted
    };
}
function formatSecondsToMMSS(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return "".concat(minutes, ":").concat(secs.toString().padStart(2, '0'));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/useAddTrackForm.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useAddTrackForm": ()=>useAddTrackForm
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$time$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/time.utils.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useAddTrackForm() {
    _s();
    const [trackUuid, setTrackUuid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tmxId, setTmxId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tierId, setTierId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mapStyleName, setMapStyleName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [timeGoalValues, setTimeGoalValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [selectedTab, setSelectedTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("uuid");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleTimeGoalChange = (timeGoalId, value)=>{
        setTimeGoalValues((prev)=>({
                ...prev,
                [timeGoalId]: value
            }));
    };
    const getTrackId = ()=>{
        return selectedTab === "uuid" ? trackUuid : tmxId;
    };
    const getTimeGoalsWithValues = (timeGoals)=>{
        return timeGoals.filter((tg)=>tg.id) // Filter out items without id
        .filter((tg)=>timeGoalValues[tg.id] && timeGoalValues[tg.id].trim() !== "").map((tg)=>({
                time_goal_id: tg.id,
                time: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$time$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeStringToMilliseconds"])(timeGoalValues[tg.id])
            }));
    };
    const resetForm = ()=>{
        setTrackUuid("");
        setTmxId("");
        setTierId(null);
        setMapStyleName("");
        setTimeGoalValues({});
    };
    const validateForm = ()=>{
        const trackId = getTrackId();
        if (!trackId) {
            return {
                isValid: false,
                error: "Track ID is required"
            };
        }
        if (!mapStyleName) {
            return {
                isValid: false,
                error: "Map Style is required"
            };
        }
        return {
            isValid: true
        };
    };
    return {
        trackUuid,
        tmxId,
        tierId,
        mapStyleName,
        timeGoalValues,
        selectedTab,
        isLoading,
        setTrackUuid,
        setTmxId,
        setTierId,
        setMapStyleName,
        setSelectedTab,
        setIsLoading,
        handleTimeGoalChange,
        getTrackId,
        getTimeGoalsWithValues,
        resetForm,
        validateForm
    };
}
_s(useAddTrackForm, "wJFpYyKAzACMslDUqwuGfnYosfg=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/services/track.service.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "trackService": ()=>trackService
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_BASE = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const trackService = {
    addToMappack: async (param)=>{
        let { mappackId, trackId, tierId, mapStyle } = param;
        await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(API_BASE, "/mappacks/").concat(mappackId, "/tracks/").concat(trackId), {
            tier_id: tierId,
            mapStyle: mapStyle
        });
    },
    addTimeGoals: async (mappackId, trackId, timeGoals)=>{
        if (timeGoals.length === 0) return;
        await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch("".concat(API_BASE, "/mappacks/").concat(mappackId, "/tracks/").concat(trackId, "/timegoals"), timeGoals);
    },
    getTrackDetails: async (mappackId, trackId, playerId)=>{
        const url = playerId ? "".concat(API_BASE, "/mappacks/").concat(mappackId, "/tracks/").concat(trackId, "?player_id=").concat(playerId) : "".concat(API_BASE, "/mappacks/").concat(mappackId, "/tracks/").concat(trackId);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(url);
        return response.data;
    },
    fetchPlayerRecords: async (trackId, playerId)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(API_BASE, "/tracks/").concat(trackId, "/records/").concat(playerId, "/fetch"));
        if (response.status !== 200) {
            throw new Error("Failed to fetch records");
        }
    },
    // FETCH TRACKS RIGHT AFTER ADDING A NEW TRACK
    fetchRecords: async (trackId)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(API_BASE, "/tracks/").concat(trackId, "/records"));
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/add-track/TrackIdInput.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TrackIdInput": ()=>TrackIdInput
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/input/dist/chunk-SQIAVXJX.mjs [app-client] (ecmascript) <export input_default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/tabs/dist/chunk-ML27DD5T.mjs [app-client] (ecmascript) <export tab_item_base_default as Tab>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$RRHVXFLZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tabs_default__as__Tabs$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/tabs/dist/chunk-RRHVXFLZ.mjs [app-client] (ecmascript) <export tabs_default as Tabs>");
;
;
function TrackIdInput(param) {
    let { selectedTab, trackUuid, tmxId, onTabChange, onUuidChange, onTmxIdChange, inputClassNames } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-[auto_1fr] items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl font-ruigslay",
                        children: "Track Info"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/add-track/TrackIdInput.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 h-[5px] bg-neutral-300"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/add-track/TrackIdInput.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/add-track/TrackIdInput.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$RRHVXFLZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tabs_default__as__Tabs$3e$__["Tabs"], {
                "aria-label": "Track ID Input Method",
                size: "md",
                selectedKey: selectedTab,
                onSelectionChange: (key)=>onTabChange(key),
                classNames: {
                    tabList: "bg-neutral-700",
                    cursor: "bg-blue-400",
                    tab: "data-[selected=true]:bg-neutral-400 data-[selected=true]:!text-white",
                    tabContent: "group-data-[selected=true]:text-white"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__["Tab"], {
                        title: "UUID",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                            label: "Track UUID",
                            placeholder: "d2b8a048-209d-4cfa-b5a4-bc3e3cab3566",
                            variant: "bordered",
                            value: trackUuid,
                            onValueChange: onUuidChange,
                            classNames: inputClassNames
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/add-track/TrackIdInput.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this)
                    }, "uuid", false, {
                        fileName: "[project]/src/app/_components/add-track/TrackIdInput.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__["Tab"], {
                        title: "TMX ID",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                            label: "TMX ID",
                            placeholder: "170211",
                            variant: "bordered",
                            value: tmxId,
                            onValueChange: onTmxIdChange,
                            classNames: inputClassNames
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/add-track/TrackIdInput.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this)
                    }, "tmxid", false, {
                        fileName: "[project]/src/app/_components/add-track/TrackIdInput.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__["Tab"], {
                        title: "TMX Search",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400 italic py-4",
                            children: "Coming soon..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/add-track/TrackIdInput.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    }, "search", false, {
                        fileName: "[project]/src/app/_components/add-track/TrackIdInput.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/add-track/TrackIdInput.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = TrackIdInput;
var _c;
__turbopack_context__.k.register(_c, "TrackIdInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/constants/map-styles.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "MAP_STYLES": ()=>MAP_STYLES
});
const MAP_STYLES = [
    {
        label: "Tech",
        key: "tech",
        description: "Tech tumbled"
    },
    {
        label: "Fullspeed",
        key: "fullspeed",
        description: "FS Toilet style"
    },
    {
        label: "Mixed",
        key: "mixed",
        description: "tm2020"
    },
    {
        label: "Dirt",
        key: "dirt",
        description: "noslide heaven"
    },
    {
        label: "RPG",
        key: "rpg",
        description: "rpg"
    },
    {
        label: "Trial",
        key: "trial",
        description: "final enigma style"
    },
    {
        label: "LOL",
        key: "giraffe",
        description: "yellaugh"
    },
    {
        label: "Ice",
        key: "ice",
        description: "icy"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TrackMetadataSelectors": ()=>TrackMetadataSelectors
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$autocomplete$2f$dist$2f$chunk$2d$RXKUWVQZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__autocomplete_default__as__Autocomplete$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/autocomplete/dist/chunk-RXKUWVQZ.mjs [app-client] (ecmascript) <export autocomplete_default as Autocomplete>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__AutocompleteItem$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/listbox/dist/chunk-BJFJ4DRR.mjs [app-client] (ecmascript) <export listbox_item_base_default as AutocompleteItem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$map$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/map-styles.ts [app-client] (ecmascript)");
;
;
;
function TrackMetadataSelectors(param) {
    let { tiers, tierId, mapStyleName, onTierChange, onStyleChange, inputClassNames } = param;
    const autocompleteClassNames = {
        base: "text-white",
        selectorButton: "text-white",
        listboxWrapper: "bg-neutral-800",
        popoverContent: "bg-neutral-800"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$autocomplete$2f$dist$2f$chunk$2d$RXKUWVQZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__autocomplete_default__as__Autocomplete$3e$__["Autocomplete"], {
                items: tiers || [],
                label: "Tier (Optional)",
                placeholder: (tiers === null || tiers === void 0 ? void 0 : tiers.length) > 0 ? "Select tier" : "No tiers available",
                variant: "bordered",
                selectedKey: tierId === null || tierId === void 0 ? void 0 : tierId.toString(),
                onSelectionChange: (key)=>onTierChange(key ? parseInt(key) : null),
                classNames: autocompleteClassNames,
                inputProps: {
                    classNames: inputClassNames
                },
                children: (tier)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__AutocompleteItem$3e$__["AutocompleteItem"], {
                        textValue: tier.name,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-4 h-4 rounded",
                                    style: {
                                        backgroundColor: tier.color
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx",
                                    lineNumber: 48,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: tier.name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx",
                                    lineNumber: 52,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-400 text-sm",
                                    children: [
                                        "(",
                                        tier.points,
                                        " pts)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx",
                                    lineNumber: 53,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx",
                            lineNumber: 47,
                            columnNumber: 13
                        }, this)
                    }, tier.id.toString(), false, {
                        fileName: "[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$autocomplete$2f$dist$2f$chunk$2d$RXKUWVQZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__autocomplete_default__as__Autocomplete$3e$__["Autocomplete"], {
                items: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$map$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAP_STYLES"],
                label: "Map Style",
                placeholder: "Search a style",
                variant: "bordered",
                selectedKey: mapStyleName,
                onSelectionChange: (key)=>onStyleChange(key),
                classNames: autocompleteClassNames,
                inputProps: {
                    classNames: inputClassNames
                },
                children: (mapStyle)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__AutocompleteItem$3e$__["AutocompleteItem"], {
                        textValue: mapStyle.label,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: mapStyle.label
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx",
                                    lineNumber: 74,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-gray-400",
                                    children: mapStyle.description
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx",
                                    lineNumber: 75,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, this)
                    }, mapStyle.key, false, {
                        fileName: "[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = TrackMetadataSelectors;
var _c;
__turbopack_context__.k.register(_c, "TrackMetadataSelectors");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/add-track/TimeGoalsInput.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TimeGoalsInput": ()=>TimeGoalsInput
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/input/dist/chunk-SQIAVXJX.mjs [app-client] (ecmascript) <export input_default as Input>");
;
;
function TimeGoalsInput(param) {
    let { timeGoals, timeGoalValues, onTimeGoalChange, inputClassNames } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-[auto_1fr] items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl font-ruigslay",
                        children: "Time Goals"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/add-track/TimeGoalsInput.tsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 h-[5px] bg-neutral-300"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/add-track/TimeGoalsInput.tsx",
                        lineNumber: 21,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/add-track/TimeGoalsInput.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            (!timeGoals || timeGoals.length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400 italic text-center py-4",
                children: "No time goals available. Add time goals to the mappack first."
            }, void 0, false, {
                fileName: "[project]/src/app/_components/add-track/TimeGoalsInput.tsx",
                lineNumber: 25,
                columnNumber: 9
            }, this),
            timeGoals && timeGoals.map((timegoal)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                    label: "".concat(timegoal.name, " (×").concat(timegoal.multiplier, ")"),
                    placeholder: "1:03:942",
                    variant: "bordered",
                    value: timeGoalValues[timegoal.id] || "",
                    onValueChange: (value)=>onTimeGoalChange(timegoal.id, value),
                    classNames: inputClassNames,
                    description: "Format: MM:SS:mmm"
                }, timegoal.id, false, {
                    fileName: "[project]/src/app/_components/add-track/TimeGoalsInput.tsx",
                    lineNumber: 32,
                    columnNumber: 11
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/add-track/TimeGoalsInput.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_c = TimeGoalsInput;
var _c;
__turbopack_context__.k.register(_c, "TimeGoalsInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/constants/modal-styles.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "MODAL_CLASSNAMES": ()=>MODAL_CLASSNAMES,
    "MODAL_INPUT_CLASSNAMES": ()=>MODAL_INPUT_CLASSNAMES,
    "TAB_CLASSNAMES": ()=>TAB_CLASSNAMES
});
const MODAL_INPUT_CLASSNAMES = {
    input: "text-white",
    inputWrapper: "bg-neutral-800 border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white"
};
const MODAL_CLASSNAMES = {
    base: "bg-neutral-800",
    header: "bg-neutral-800 text-white",
    body: "bg-neutral-800 text-white",
    footer: "bg-neutral-800",
    closeButton: "text-white hover:bg-neutral-800"
};
const TAB_CLASSNAMES = {
    tabList: "bg-neutral-700",
    cursor: "bg-neutral-600",
    tab: "text-white",
    tabContent: "group-data-[selected=true]:text-white"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/AddTrackModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>AddTrackModal
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/button/dist/chunk-WBUKVQRU.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$TW2E3XVA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_default__as__Modal$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-TW2E3XVA.mjs [app-client] (ecmascript) <export modal_default as Modal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$NWAOTABO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_content_default__as__ModalContent$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-NWAOTABO.mjs [app-client] (ecmascript) <export modal_content_default as ModalContent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$R7OT77UN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_header_default__as__ModalHeader$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-R7OT77UN.mjs [app-client] (ecmascript) <export modal_header_default as ModalHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$HNQZEMGR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_body_default__as__ModalBody$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-HNQZEMGR.mjs [app-client] (ecmascript) <export modal_body_default as ModalBody>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$5LXTSPS7$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_footer_default__as__ModalFooter$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-5LXTSPS7.mjs [app-client] (ecmascript) <export modal_footer_default as ModalFooter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$use$2d$disclosure$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@heroui/use-disclosure/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAddTrackForm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAddTrackForm.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$track$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/track.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$add$2d$track$2f$TrackIdInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/add-track/TrackIdInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$add$2d$track$2f$TrackMetadataSelectors$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/add-track/TrackMetadataSelectors.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$add$2d$track$2f$TimeGoalsInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/add-track/TimeGoalsInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/modal-styles.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
function AddTrackModal(param) {
    let { timegoals, mappackId, tiers } = param;
    _s();
    const { isOpen, onOpen, onOpenChange } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$use$2d$disclosure$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDisclosure"])();
    const { trackUuid, tmxId, tierId, mapStyleName, timeGoalValues, selectedTab, isLoading, setTrackUuid, setTmxId, setTierId, setMapStyleName, setSelectedTab, setIsLoading, handleTimeGoalChange, getTrackId, getTimeGoalsWithValues, resetForm, validateForm } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAddTrackForm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddTrackForm"])();
    const handleAddTrack = async ()=>{
        const validation = validateForm();
        if (!validation.isValid) {
            alert(validation.error);
            return;
        }
        try {
            setIsLoading(true);
            const trackId = getTrackId();
            // Add track to mappack
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$track$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackService"].addToMappack({
                mappackId,
                trackId,
                tierId,
                mapStyle: mapStyleName
            });
            const timeGoalsWithValues = getTimeGoalsWithValues(timegoals);
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$track$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackService"].addTimeGoals(mappackId, trackId, timeGoalsWithValues);
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$track$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackService"].fetchRecords(trackId);
            resetForm();
            onOpenChange();
            window.location.reload();
        } catch (error) {
            console.error("Error adding track:", error);
            alert("Failed to add track. Please try again.");
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                color: "default",
                variant: "bordered",
                onPress: onOpen,
                children: "Add New Track"
            }, void 0, false, {
                fileName: "[project]/src/app/_components/AddTrackModal.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$TW2E3XVA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_default__as__Modal$3e$__["Modal"], {
                isOpen: isOpen,
                placement: "top-center",
                onOpenChange: onOpenChange,
                size: "2xl",
                classNames: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODAL_CLASSNAMES"],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$NWAOTABO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_content_default__as__ModalContent$3e$__["ModalContent"], {
                    children: (onClose)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$R7OT77UN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_header_default__as__ModalHeader$3e$__["ModalHeader"], {
                                    className: "flex flex-col gap-1 text-2xl font-ruigslay",
                                    children: "Add Track to Mappack"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/AddTrackModal.tsx",
                                    lineNumber: 106,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$HNQZEMGR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_body_default__as__ModalBody$3e$__["ModalBody"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$add$2d$track$2f$TrackIdInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrackIdInput"], {
                                            selectedTab: selectedTab,
                                            trackUuid: trackUuid,
                                            tmxId: tmxId,
                                            onTabChange: setSelectedTab,
                                            onUuidChange: setTrackUuid,
                                            onTmxIdChange: setTmxId,
                                            inputClassNames: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODAL_INPUT_CLASSNAMES"]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/_components/AddTrackModal.tsx",
                                            lineNumber: 110,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$add$2d$track$2f$TrackMetadataSelectors$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrackMetadataSelectors"], {
                                            tiers: tiers,
                                            tierId: tierId,
                                            mapStyleName: mapStyleName,
                                            onTierChange: setTierId,
                                            onStyleChange: setMapStyleName,
                                            inputClassNames: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODAL_INPUT_CLASSNAMES"]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/_components/AddTrackModal.tsx",
                                            lineNumber: 120,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$add$2d$track$2f$TimeGoalsInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimeGoalsInput"], {
                                            timeGoals: timegoals,
                                            timeGoalValues: timeGoalValues,
                                            onTimeGoalChange: handleTimeGoalChange,
                                            inputClassNames: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODAL_INPUT_CLASSNAMES"]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/_components/AddTrackModal.tsx",
                                            lineNumber: 129,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/_components/AddTrackModal.tsx",
                                    lineNumber: 109,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$5LXTSPS7$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_footer_default__as__ModalFooter$3e$__["ModalFooter"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                            color: "default",
                                            variant: "bordered",
                                            onPress: onClose,
                                            isDisabled: isLoading,
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/_components/AddTrackModal.tsx",
                                            lineNumber: 137,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                            color: "default",
                                            onPress: handleAddTrack,
                                            isLoading: isLoading,
                                            children: "Add Track"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/_components/AddTrackModal.tsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/_components/AddTrackModal.tsx",
                                    lineNumber: 136,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/AddTrackModal.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/_components/AddTrackModal.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/AddTrackModal.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(AddTrackModal, "LQvFfkGCsZ4Ju7Kwj+2ZLaCYrQw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$use$2d$disclosure$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDisclosure"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAddTrackForm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddTrackForm"]
    ];
});
_c = AddTrackModal;
var _c;
__turbopack_context__.k.register(_c, "AddTrackModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/useEditMappack.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// hooks/useEditMappack.ts
__turbopack_context__.s({
    "useEditMappack": ()=>useEditMappack
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$time$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/time.utils.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useEditMappack(mappack, isOpen) {
    _s();
    const [editData, setEditData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [timeInputValues, setTimeInputValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useEditMappack.useEffect": ()=>{
            if (isOpen && mappack) {
                const deepCopy = JSON.parse(JSON.stringify(mappack));
                const sanitizedData = {
                    ...deepCopy,
                    timeGoals: deepCopy.timeGoals || [],
                    mappackTiers: deepCopy.mappackTiers || [],
                    mappackRanks: deepCopy.mappackRanks || [],
                    MappackTrack: (deepCopy.MappackTrack || []).map({
                        "useEditMappack.useEffect": (track)=>({
                                ...track,
                                timeGoalMappackTrack: track.timeGoalMappackTrack || [],
                                tier: track.tier || null,
                                mapStyle: track.mapStyle || null,
                                tier_id: track.tier_id || null
                            })
                    }["useEditMappack.useEffect"])
                };
                setEditData(sanitizedData);
            }
        }
    }["useEditMappack.useEffect"], [
        isOpen,
        mappack
    ]);
    const addTimeGoal = ()=>{
        if (!editData) return;
        setEditData({
            ...editData,
            timeGoals: [
                ...editData.timeGoals,
                {
                    name: "",
                    mappack_id: editData.id,
                    multiplier: 1
                }
            ]
        });
    };
    const updateTimeGoal = (index, field, value)=>{
        if (!editData) return;
        setEditData({
            ...editData,
            timeGoals: editData.timeGoals.map((tg, i)=>i === index ? {
                    ...tg,
                    [field]: value
                } : tg)
        });
    };
    const removeTimeGoalFromState = (id)=>{
        if (!editData) return;
        if (!id) {
            setEditData({
                ...editData,
                timeGoals: editData.timeGoals.slice(0, -1)
            });
        } else {
            setEditData({
                ...editData,
                timeGoals: editData.timeGoals.filter((tg)=>tg.id !== id),
                MappackTrack: editData.MappackTrack.map((track)=>({
                        ...track,
                        timeGoalMappackTrack: track.timeGoalMappackTrack.filter((tgmt)=>tgmt.time_goal_id !== id)
                    }))
            });
        }
    };
    const addTier = ()=>{
        if (!editData) return;
        const newTier = {
            name: "",
            mappack_id: editData.id,
            points: 0,
            color: "#ffffff"
        };
        setEditData({
            ...editData,
            mappackTiers: [
                ...editData.mappackTiers,
                newTier
            ]
        });
    };
    const updateTier = (index, field, value)=>{
        if (!editData) return;
        const updatedTiers = editData.mappackTiers.map((tier, i)=>i === index ? {
                ...tier,
                [field]: value
            } : tier);
        setEditData({
            ...editData,
            mappackTiers: updatedTiers
        });
    };
    const removeTierFromState = (id)=>{
        if (!editData) return;
        if (!id) {
            setEditData({
                ...editData,
                mappackTiers: editData.mappackTiers.slice(0, -1)
            });
        } else {
            setEditData({
                ...editData,
                mappackTiers: editData.mappackTiers.filter((t)=>t.id !== id),
                MappackTrack: editData.MappackTrack.map((track)=>track.tier_id === id ? {
                        ...track,
                        tier_id: null,
                        tier: null
                    } : track)
            });
        }
    };
    const addRank = ()=>{
        if (!editData) return;
        const newRank = {
            name: "",
            mappack_id: editData.id,
            pointsNeeded: 0,
            color: "#ffffff",
            backgroundGlow: false,
            invertedColor: false,
            textShadow: false,
            glowIntensity: 50,
            borderWidth: 2,
            borderColor: null,
            symbolsAround: null,
            animationType: "none",
            cardStyle: "normal",
            backgroundPattern: "none",
            fontSize: "normal",
            fontWeight: "normal"
        };
        setEditData({
            ...editData,
            mappackRanks: [
                ...editData.mappackRanks,
                newRank
            ]
        });
    };
    const updateRank = (index, field, value)=>{
        if (!editData) return;
        const updatedRanks = editData.mappackRanks.map((rank, i)=>i === index ? {
                ...rank,
                [field]: value
            } : rank);
        setEditData({
            ...editData,
            mappackRanks: updatedRanks
        });
    };
    const removeRankFromState = (id)=>{
        if (!editData) return;
        if (!id) {
            setEditData({
                ...editData,
                mappackRanks: editData.mappackRanks.slice(0, -1)
            });
        } else {
            setEditData({
                ...editData,
                mappackRanks: editData.mappackRanks.filter((r)=>r.id !== id)
            });
        }
    };
    const assignTierToTrack = (trackId, tierId)=>{
        if (!editData) return;
        const tier = tierId ? editData.mappackTiers.find((t)=>t.id === tierId) : null;
        setEditData({
            ...editData,
            MappackTrack: editData.MappackTrack.map((track)=>track.track_id === trackId ? {
                    ...track,
                    tier_id: tierId,
                    tier: tier || null
                } : track)
        });
    };
    const updateTrackTime = (trackId, timeGoalId, timeString)=>{
        if (!editData) return;
        setTimeInputValues((prev)=>({
                ...prev,
                [trackId]: {
                    ...prev[trackId] || {},
                    [timeGoalId]: timeString
                }
            }));
        const milliseconds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$time$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeStringToMilliseconds"])(timeString);
        setEditData({
            ...editData,
            MappackTrack: editData.MappackTrack.map((track)=>{
                if (track.track_id !== trackId) return track;
                const existingIndex = track.timeGoalMappackTrack.findIndex((tgmt)=>tgmt.time_goal_id === timeGoalId);
                if (existingIndex >= 0) {
                    return {
                        ...track,
                        timeGoalMappackTrack: track.timeGoalMappackTrack.map((tgmt, i)=>i === existingIndex ? {
                                ...tgmt,
                                time: milliseconds
                            } : tgmt)
                    };
                } else {
                    return {
                        ...track,
                        timeGoalMappackTrack: [
                            ...track.timeGoalMappackTrack,
                            {
                                track_id: trackId,
                                mappack_id: editData.id,
                                time_goal_id: timeGoalId,
                                time: milliseconds
                            }
                        ]
                    };
                }
            })
        });
    };
    const updateMapStyle = (trackId, mapStyle)=>{
        if (!editData) return;
        setEditData({
            ...editData,
            MappackTrack: editData.MappackTrack.map((t)=>t.track_id === trackId ? {
                    ...t,
                    mapStyle: mapStyle || null
                } : t)
        });
    };
    const removeTrackFromState = (trackId)=>{
        if (!editData) return;
        setEditData({
            ...editData,
            MappackTrack: editData.MappackTrack.filter((t)=>t.track_id !== trackId)
        });
    };
    return {
        editData,
        setEditData,
        timeInputValues,
        addTimeGoal,
        updateTimeGoal,
        removeTimeGoalFromState,
        addTier,
        updateTier,
        removeTierFromState,
        addRank,
        updateRank,
        removeRankFromState,
        assignTierToTrack,
        updateTrackTime,
        updateMapStyle,
        removeTrackFromState
    };
}
_s(useEditMappack, "Gswr+0Rkk05LyzlO98/io1rweic=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/services/mappack-edit.service.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "mappackEditService": ()=>mappackEditService
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const mappackEditService = {
    updateMappack: async (mappack)=>{
        const payload = {
            id: mappack.id,
            name: mappack.name,
            description: mappack.description,
            thumbnailURL: mappack.thumbnailURL,
            isActive: mappack.isActive,
            timeGoals: mappack.timeGoals.map((tg)=>({
                    id: tg.id,
                    name: tg.name,
                    mappack_id: mappack.id,
                    multiplier: tg.multiplier
                })),
            mappackTiers: mappack.mappackTiers.map((tier)=>({
                    id: tier.id,
                    name: tier.name,
                    mappack_id: mappack.id,
                    points: tier.points,
                    color: tier.color
                })),
            mappackRanks: mappack.mappackRanks.map((rank)=>({
                    id: rank.id,
                    name: rank.name,
                    mappack_id: mappack.id,
                    pointsNeeded: rank.pointsNeeded,
                    color: rank.color,
                    backgroundGlow: rank.backgroundGlow,
                    invertedColor: rank.invertedColor,
                    textShadow: rank.textShadow,
                    glowIntensity: rank.glowIntensity,
                    borderWidth: rank.borderWidth,
                    borderColor: rank.borderColor,
                    symbolsAround: rank.symbolsAround,
                    animationType: rank.animationType,
                    cardStyle: rank.cardStyle,
                    backgroundPattern: rank.backgroundPattern,
                    fontSize: rank.fontSize,
                    fontWeight: rank.fontWeight
                })),
            MappackTrack: mappack.MappackTrack.map((track)=>({
                    mappack_id: track.mappack_id,
                    track_id: track.track_id,
                    tier_id: track.tier_id,
                    mapStyle: track.mapStyle,
                    timeGoalMappackTrack: track.timeGoalMappackTrack.map((tg)=>({
                            track_id: track.track_id,
                            mappack_id: mappack.id,
                            time_goal_id: tg.time_goal_id,
                            time: tg.time
                        }))
                }))
        };
        const response = await fetch("".concat(API_BASE, "/mappacks"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error("Failed to update mappack: ".concat(errorText));
        }
    },
    deleteTimeGoal: async (mappackId, timeGoalId)=>{
        const response = await fetch("".concat(API_BASE, "/mappacks/").concat(mappackId, "/timegoals/").concat(timeGoalId), {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to delete time goal");
    },
    deleteTier: async (mappackId, tierId)=>{
        const response = await fetch("".concat(API_BASE, "/mappacks/").concat(mappackId, "/tiers/").concat(tierId), {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to delete tier");
    },
    deleteRank: async (mappackId, rankId)=>{
        const response = await fetch("".concat(API_BASE, "/mappacks/").concat(mappackId, "/ranks/").concat(rankId), {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to delete rank");
    },
    deleteTrack: async (mappackId, trackId)=>{
        const response = await fetch("".concat(API_BASE, "/mappacks/").concat(mappackId, "/tracks/").concat(trackId), {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to delete track");
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/ConfirmDialog.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ConfirmDialog": ()=>ConfirmDialog
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$TW2E3XVA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_default__as__Modal$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-TW2E3XVA.mjs [app-client] (ecmascript) <export modal_default as Modal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$NWAOTABO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_content_default__as__ModalContent$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-NWAOTABO.mjs [app-client] (ecmascript) <export modal_content_default as ModalContent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$R7OT77UN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_header_default__as__ModalHeader$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-R7OT77UN.mjs [app-client] (ecmascript) <export modal_header_default as ModalHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$HNQZEMGR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_body_default__as__ModalBody$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-HNQZEMGR.mjs [app-client] (ecmascript) <export modal_body_default as ModalBody>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$5LXTSPS7$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_footer_default__as__ModalFooter$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-5LXTSPS7.mjs [app-client] (ecmascript) <export modal_footer_default as ModalFooter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/button/dist/chunk-WBUKVQRU.mjs [app-client] (ecmascript) <export button_default as Button>");
;
;
function ConfirmDialog(param) {
    let { isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDangerous = false } = param;
    const handleConfirm = ()=>{
        onConfirm();
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$TW2E3XVA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_default__as__Modal$3e$__["Modal"], {
        isOpen: isOpen,
        onOpenChange: onClose,
        placement: "center",
        classNames: {
            base: "bg-neutral-800",
            header: "bg-neutral-800 text-white border-b border-white/10",
            body: "bg-neutral-800 text-white",
            footer: "bg-neutral-800 border-t border-white/10",
            closeButton: "text-white hover:bg-neutral-700"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$NWAOTABO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_content_default__as__ModalContent$3e$__["ModalContent"], {
            children: (onClose)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$R7OT77UN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_header_default__as__ModalHeader$3e$__["ModalHeader"], {
                            className: "text-2xl font-ruigslay",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/ConfirmDialog.tsx",
                            lineNumber: 45,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$HNQZEMGR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_body_default__as__ModalBody$3e$__["ModalBody"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-white/90",
                                children: message
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/ConfirmDialog.tsx",
                                lineNumber: 47,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/ConfirmDialog.tsx",
                            lineNumber: 46,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$5LXTSPS7$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_footer_default__as__ModalFooter$3e$__["ModalFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    color: "default",
                                    variant: "bordered",
                                    onPress: onClose,
                                    children: cancelText
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/ConfirmDialog.tsx",
                                    lineNumber: 50,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    color: isDangerous ? "danger" : "default",
                                    onPress: handleConfirm,
                                    children: confirmText
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/ConfirmDialog.tsx",
                                    lineNumber: 53,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/_components/ConfirmDialog.tsx",
                            lineNumber: 49,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
        }, void 0, false, {
            fileName: "[project]/src/app/_components/ConfirmDialog.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/_components/ConfirmDialog.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_c = ConfirmDialog;
var _c;
__turbopack_context__.k.register(_c, "ConfirmDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/mappack-edit/BasicInfoTab.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "BasicInfoTab": ()=>BasicInfoTab
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/input/dist/chunk-SQIAVXJX.mjs [app-client] (ecmascript) <export input_default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$switch$2f$dist$2f$chunk$2d$I3A4XRYQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__switch_default__as__Switch$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/switch/dist/chunk-I3A4XRYQ.mjs [app-client] (ecmascript) <export switch_default as Switch>");
;
;
function BasicInfoTab(param) {
    let { editData, onUpdate, inputClassNames } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-[auto_1fr] items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl font-ruigslay",
                        children: "Mappack Info"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/BasicInfoTab.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 h-[5px] bg-neutral-300"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/BasicInfoTab.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/BasicInfoTab.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                label: "Name",
                variant: "bordered",
                value: editData.name,
                onValueChange: (value)=>onUpdate({
                        name: value
                    }),
                classNames: inputClassNames
            }, void 0, false, {
                fileName: "[project]/src/app/_components/mappack-edit/BasicInfoTab.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                label: "Description",
                variant: "bordered",
                value: editData.description,
                onValueChange: (value)=>onUpdate({
                        description: value
                    }),
                classNames: inputClassNames
            }, void 0, false, {
                fileName: "[project]/src/app/_components/mappack-edit/BasicInfoTab.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                label: "Thumbnail URL",
                variant: "bordered",
                value: editData.thumbnailURL,
                onValueChange: (value)=>onUpdate({
                        thumbnailURL: value
                    }),
                classNames: inputClassNames
            }, void 0, false, {
                fileName: "[project]/src/app/_components/mappack-edit/BasicInfoTab.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$switch$2f$dist$2f$chunk$2d$I3A4XRYQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__switch_default__as__Switch$3e$__["Switch"], {
                isSelected: editData.isActive,
                onValueChange: (checked)=>onUpdate({
                        isActive: checked
                    }),
                classNames: {
                    wrapper: "group-data-[selected=true]:bg-white bg-neutral-600"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-white",
                    children: "Active"
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/mappack-edit/BasicInfoTab.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/_components/mappack-edit/BasicInfoTab.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/mappack-edit/BasicInfoTab.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = BasicInfoTab;
var _c;
__turbopack_context__.k.register(_c, "BasicInfoTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/mappack-edit/TimeGoalsTab.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TimeGoalsTab": ()=>TimeGoalsTab
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/button/dist/chunk-WBUKVQRU.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/input/dist/chunk-SQIAVXJX.mjs [app-client] (ecmascript) <export input_default as Input>");
;
;
function TimeGoalsTab(param) {
    let { timeGoals, onAdd, onUpdate, onRemove, inputClassNames } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-[auto_1fr] items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl font-ruigslay",
                        children: "Time Goals"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/TimeGoalsTab.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 h-[5px] bg-neutral-300"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/TimeGoalsTab.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/TimeGoalsTab.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            timeGoals.map((timegoal, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 items-center bg-neutral-800 p-3 rounded-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                            label: "Name",
                            variant: "bordered",
                            value: timegoal.name,
                            onValueChange: (value)=>onUpdate(index, "name", value),
                            className: "flex-1",
                            classNames: inputClassNames
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/mappack-edit/TimeGoalsTab.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                            label: "Multiplier",
                            type: "number",
                            variant: "bordered",
                            value: timegoal.multiplier.toString(),
                            onValueChange: (value)=>onUpdate(index, "multiplier", parseInt(value) || 1),
                            className: "w-32",
                            classNames: inputClassNames
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/mappack-edit/TimeGoalsTab.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                            size: "sm",
                            color: "danger",
                            variant: "flat",
                            onPress: ()=>onRemove(timegoal.id),
                            isIconOnly: true,
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/mappack-edit/TimeGoalsTab.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, timegoal.id || "new-".concat(index), true, {
                    fileName: "[project]/src/app/_components/mappack-edit/TimeGoalsTab.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                color: "default",
                onPress: onAdd,
                children: "Add Time Goal"
            }, void 0, false, {
                fileName: "[project]/src/app/_components/mappack-edit/TimeGoalsTab.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/mappack-edit/TimeGoalsTab.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c = TimeGoalsTab;
var _c;
__turbopack_context__.k.register(_c, "TimeGoalsTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/colorPicker.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ColorPicker": ()=>ColorPicker
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$popover$2f$dist$2f$chunk$2d$AT5AFJ6L$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__popover_default__as__Popover$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/popover/dist/chunk-AT5AFJ6L.mjs [app-client] (ecmascript) <export popover_default as Popover>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$popover$2f$dist$2f$chunk$2d$6FXDB7ZT$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__popover_trigger_default__as__PopoverTrigger$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/popover/dist/chunk-6FXDB7ZT.mjs [app-client] (ecmascript) <export popover_trigger_default as PopoverTrigger>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$popover$2f$dist$2f$chunk$2d$Z57F4COC$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__popover_content_default__as__PopoverContent$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/popover/dist/chunk-Z57F4COC.mjs [app-client] (ecmascript) <export popover_content_default as PopoverContent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/button/dist/chunk-WBUKVQRU.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/input/dist/chunk-SQIAVXJX.mjs [app-client] (ecmascript) <export input_default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$colorful$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-colorful/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function ColorPicker(param) {
    let { value, onChange, label = "Color" } = param;
    _s();
    const [hexInput, setHexInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value);
    const handleHexChange = (newHex)=>{
        setHexInput(newHex);
        if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) {
            onChange(newHex);
        }
    };
    const handleColorChange = (newColor)=>{
        setHexInput(newColor);
        onChange(newColor);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$popover$2f$dist$2f$chunk$2d$AT5AFJ6L$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__popover_default__as__Popover$3e$__["Popover"], {
        placement: "bottom",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$popover$2f$dist$2f$chunk$2d$6FXDB7ZT$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__popover_trigger_default__as__PopoverTrigger$3e$__["PopoverTrigger"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                    className: "w-32 h-14 justify-start px-3 border border-gray-700 hover:border-gray-600 bg-transparent",
                    variant: "bordered",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 rounded border border-gray-600",
                                style: {
                                    backgroundColor: value
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/utils/colorPicker.tsx",
                                lineNumber: 34,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-start flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-400",
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/src/utils/colorPicker.tsx",
                                        lineNumber: 39,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white font-mono",
                                        children: value.toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/src/utils/colorPicker.tsx",
                                        lineNumber: 40,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utils/colorPicker.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/utils/colorPicker.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/utils/colorPicker.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/utils/colorPicker.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$popover$2f$dist$2f$chunk$2d$Z57F4COC$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__popover_content_default__as__PopoverContent$3e$__["PopoverContent"], {
                className: "bg-neutral-800 border border-gray-700 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$colorful$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HexColorPicker"], {
                            color: value,
                            onChange: handleColorChange
                        }, void 0, false, {
                            fileName: "[project]/src/utils/colorPicker.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                            label: "Hex Code",
                            variant: "bordered",
                            value: hexInput,
                            onValueChange: handleHexChange,
                            placeholder: "#FFFFFF",
                            classNames: {
                                input: "text-white font-mono",
                                inputWrapper: "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white"
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/utils/colorPicker.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-1 flex-wrap justify-center",
                            children: [
                                '#ff0000ff',
                                '#ff7b00ff',
                                '#ffbf00ff',
                                '#ffea00ff',
                                '#000000ff',
                                '#FFFFFF'
                            ].map((presetColor)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "w-6 h-6 rounded border border-gray-600 hover:scale-110 transition-transform",
                                    style: {
                                        backgroundColor: presetColor
                                    },
                                    onClick: ()=>handleColorChange(presetColor)
                                }, presetColor, false, {
                                    fileName: "[project]/src/utils/colorPicker.tsx",
                                    lineNumber: 61,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/utils/colorPicker.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/utils/colorPicker.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/utils/colorPicker.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/utils/colorPicker.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_s(ColorPicker, "bSLT3sJRwi9DpqGYjoH/O3iuzZE=");
_c = ColorPicker;
var _c;
__turbopack_context__.k.register(_c, "ColorPicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/textConverter.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "FormattedText": ()=>FormattedText,
    "useFormattedText": ()=>useFormattedText
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
function createDefaultStyle() {
    return {
        color: undefined,
        bold: false,
        italic: false,
        wide: false,
        narrow: false,
        uppercase: false,
        shadow: false
    };
}
function parseFormattedText(input) {
    const segments = [];
    let currentStyle = createDefaultStyle();
    let currentText = '';
    let currentLink = undefined;
    let i = 0;
    const pushSegment = ()=>{
        if (currentText) {
            segments.push({
                text: currentText,
                style: {
                    ...currentStyle
                },
                link: currentLink
            });
            currentText = '';
        }
    };
    while(i < input.length){
        if (input[i] === '$' && i + 1 < input.length) {
            const nextChar = input[i + 1];
            const nextCharLower = nextChar.toLowerCase();
            if (i + 3 < input.length && /^[0-9a-fA-F]{3}$/.test(input.slice(i + 1, i + 4))) {
                pushSegment();
                const hex = input.slice(i + 1, i + 4);
                currentStyle.color = "#".concat(hex);
                i += 4;
                continue;
            }
            if (nextChar === '$') {
                currentText += '$';
                i += 2;
                continue;
            }
            if (nextCharLower === 'z') {
                pushSegment();
                currentStyle = createDefaultStyle();
                i += 2;
                continue;
            }
            if (nextCharLower === 'g') {
                pushSegment();
                currentStyle.color = undefined;
                i += 2;
                continue;
            }
            if (nextCharLower === 'o') {
                pushSegment();
                currentStyle.bold = true;
                i += 2;
                continue;
            }
            if (nextCharLower === 'i') {
                pushSegment();
                currentStyle.italic = true;
                i += 2;
                continue;
            }
            if (nextCharLower === 'w') {
                pushSegment();
                currentStyle.wide = true;
                currentStyle.narrow = false;
                i += 2;
                continue;
            }
            if (nextCharLower === 'n') {
                pushSegment();
                currentStyle.narrow = true;
                currentStyle.wide = false;
                i += 2;
                continue;
            }
            if (nextCharLower === 'm') {
                pushSegment();
                currentStyle.wide = false;
                currentStyle.narrow = false;
                i += 2;
                continue;
            }
            if (nextCharLower === 't') {
                pushSegment();
                currentStyle.uppercase = true;
                i += 2;
                continue;
            }
            if (nextCharLower === 's') {
                pushSegment();
                currentStyle.shadow = true;
                i += 2;
                continue;
            }
            if (nextCharLower === 'l') {
                pushSegment();
                i += 2;
                if (currentLink !== undefined) {
                    currentLink = undefined;
                    continue;
                }
                if (i < input.length && input[i] === '[') {
                    const closeBracket = input.indexOf(']', i);
                    if (closeBracket !== -1) {
                        currentLink = input.slice(i + 1, closeBracket);
                        i = closeBracket + 1;
                    }
                } else {
                    const endLink = input.toLowerCase().indexOf('$l', i);
                    if (endLink !== -1) {
                        currentLink = input.slice(i, endLink);
                        currentText = currentLink;
                        i = endLink;
                    } else {
                        currentLink = input.slice(i);
                        currentText = currentLink;
                        i = input.length;
                    }
                }
                continue;
            }
        }
        currentText += input[i];
        i++;
    }
    pushSegment();
    return segments;
}
function FormattedText(param) {
    let { text, className = '' } = param;
    _s();
    const segments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormattedText.useMemo[segments]": ()=>parseFormattedText(text)
    }["FormattedText.useMemo[segments]"], [
        text
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: className,
        children: segments.map((segment, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: segment.style.color
                },
                className: segment.style.bold ? 'font-bold' : '',
                children: segment.text
            }, index, false, {
                fileName: "[project]/src/utils/textConverter.tsx",
                lineNumber: 184,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/utils/textConverter.tsx",
        lineNumber: 182,
        columnNumber: 5
    }, this);
}
_s(FormattedText, "EvbWsum4eCE3Qen/DIDQlqqeiME=");
_c = FormattedText;
function useFormattedText(text) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useFormattedText.useMemo": ()=>parseFormattedText(text)
    }["useFormattedText.useMemo"], [
        text
    ]);
}
_s1(useFormattedText, "nwk+m61qLgjDVUp4IGV/072DDN4=");
var _c;
__turbopack_context__.k.register(_c, "FormattedText");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/mappack-edit/TiersTab.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TiersTab": ()=>TiersTab
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/button/dist/chunk-WBUKVQRU.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/input/dist/chunk-SQIAVXJX.mjs [app-client] (ecmascript) <export input_default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$select$2f$dist$2f$chunk$2d$C3QHEOC2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__select_default__as__Select$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/select/dist/chunk-C3QHEOC2.mjs [app-client] (ecmascript) <export select_default as Select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/listbox/dist/chunk-BJFJ4DRR.mjs [app-client] (ecmascript) <export listbox_item_base_default as SelectItem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$image$2f$dist$2f$chunk$2d$PGYMO5KK$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__image_default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/image/dist/chunk-PGYMO5KK.mjs [app-client] (ecmascript) <export image_default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$colorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/colorPicker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$textConverter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/textConverter.tsx [app-client] (ecmascript)");
;
;
;
;
function TiersTab(param) {
    let { tiers, tracks, onAddTier, onUpdateTier, onRemoveTier, onAssignTier, inputClassNames } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-[auto_1fr] items-center gap-2 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-ruigslay",
                                children: "Available Tiers"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 h-[5px] bg-neutral-300"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                lineNumber: 30,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    tiers.map((tier, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 mb-3 items-end bg-neutral-800 p-3 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                                    label: "Tier Name",
                                    variant: "bordered",
                                    value: tier.name,
                                    onValueChange: (value)=>onUpdateTier(index, "name", value),
                                    className: "flex-1",
                                    classNames: inputClassNames
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                                    label: "Points",
                                    type: "number",
                                    variant: "bordered",
                                    value: tier.points.toString(),
                                    onValueChange: (value)=>onUpdateTier(index, "points", parseInt(value) || 0),
                                    className: "w-24",
                                    classNames: inputClassNames
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$colorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColorPicker"], {
                                    value: tier.color,
                                    onChange: (value)=>onUpdateTier(index, "color", value),
                                    label: "Tier Color"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    color: "danger",
                                    variant: "flat",
                                    onPress: ()=>onRemoveTier(tier.id),
                                    isIconOnly: true,
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, tier.id || "new-".concat(index), true, {
                            fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                        color: "default",
                        onPress: onAddTier,
                        children: "Add Tier"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-[auto_2fr] items-center gap-2 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-ruigslay",
                                children: "Track Tier Assignment"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 h-[5px] bg-neutral-300"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    tracks.map((mappackTrack)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 mb-3 items-center bg-neutral-700 p-3 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$image$2f$dist$2f$chunk$2d$PGYMO5KK$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__image_default__as__Image$3e$__["Image"], {
                                    removeWrapper: true,
                                    alt: "Track thumbnail",
                                    className: "z-0 w-16 h-16 object-cover rounded",
                                    src: mappackTrack.track.thumbnailUrl
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                    lineNumber: 86,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$textConverter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormattedText"], {
                                        text: mappackTrack.track.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                        lineNumber: 93,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$select$2f$dist$2f$chunk$2d$C3QHEOC2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__select_default__as__Select$3e$__["Select"], {
                                    label: "Tier",
                                    variant: "bordered",
                                    selectedKeys: mappackTrack.tier_id ? [
                                        mappackTrack.tier_id.toString()
                                    ] : [],
                                    onSelectionChange: (keys)=>{
                                        const selectedTierId = Array.from(keys)[0];
                                        onAssignTier(mappackTrack.track_id, selectedTierId ? parseInt(selectedTierId) : null);
                                    },
                                    className: "w-48",
                                    classNames: {
                                        ...inputClassNames,
                                        listboxWrapper: "bg-neutral-800",
                                        popoverContent: "bg-neutral-800",
                                        label: "text-white",
                                        value: "text-white"
                                    },
                                    children: tiers.filter((tier)=>tier.id).map((tier)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                            children: tier.name || "(Unnamed)"
                                        }, tier.id.toString(), false, {
                                            fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                            lineNumber: 122,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this),
                                mappackTrack.tier && mappackTrack.tier.color && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-8 h-8 rounded border border-gray-600",
                                    style: {
                                        backgroundColor: mappackTrack.tier.color
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                                    lineNumber: 128,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, mappackTrack.track_id, true, {
                            fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this)),
                    tiers.filter((t)=>t.id).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-400 italic mt-2",
                        children: "No tiers available. Create and save tiers first to assign them to tracks."
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/mappack-edit/TiersTab.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_c = TiersTab;
var _c;
__turbopack_context__.k.register(_c, "TiersTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/mappack-edit/RankEditor.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "RankEditor": ()=>RankEditor
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/button/dist/chunk-WBUKVQRU.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/input/dist/chunk-SQIAVXJX.mjs [app-client] (ecmascript) <export input_default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$select$2f$dist$2f$chunk$2d$C3QHEOC2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__select_default__as__Select$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/select/dist/chunk-C3QHEOC2.mjs [app-client] (ecmascript) <export select_default as Select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/listbox/dist/chunk-BJFJ4DRR.mjs [app-client] (ecmascript) <export listbox_item_base_default as SelectItem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$switch$2f$dist$2f$chunk$2d$I3A4XRYQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__switch_default__as__Switch$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/switch/dist/chunk-I3A4XRYQ.mjs [app-client] (ecmascript) <export switch_default as Switch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$colorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/colorPicker.tsx [app-client] (ecmascript)");
;
;
;
function RankEditor(param) {
    let { rank, index, onUpdate, onRemove, inputClassNames } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border border-gray-600 rounded-lg p-4 bg-neutral-700 space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                        label: "Rank Name",
                        variant: "bordered",
                        value: rank.name,
                        onValueChange: (value)=>onUpdate(index, "name", value),
                        classNames: inputClassNames
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                        label: "Points Needed",
                        type: "number",
                        variant: "bordered",
                        value: rank.pointsNeeded.toString(),
                        onValueChange: (value)=>onUpdate(index, "pointsNeeded", parseInt(value) || 0),
                        classNames: inputClassNames
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-3 items-end",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$colorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColorPicker"], {
                        value: rank.color,
                        onChange: (value)=>onUpdate(index, "color", value),
                        label: "Primary Color"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$colorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColorPicker"], {
                        value: rank.borderColor || rank.color,
                        onChange: (value)=>onUpdate(index, "borderColor", value),
                        label: "Border Color"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                        label: "Border Width (px)",
                        type: "number",
                        variant: "bordered",
                        value: rank.borderWidth.toString(),
                        onValueChange: (value)=>onUpdate(index, "borderWidth", parseInt(value) || 2),
                        classNames: inputClassNames
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$switch$2f$dist$2f$chunk$2d$I3A4XRYQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__switch_default__as__Switch$3e$__["Switch"], {
                        isSelected: rank.backgroundGlow,
                        onValueChange: (checked)=>onUpdate(index, "backgroundGlow", checked),
                        classNames: {
                            wrapper: "group-data-[selected=true]:bg-white bg-neutral-600"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white text-sm",
                            children: "Background Glow"
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$switch$2f$dist$2f$chunk$2d$I3A4XRYQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__switch_default__as__Switch$3e$__["Switch"], {
                        isSelected: rank.invertedColor,
                        onValueChange: (checked)=>onUpdate(index, "invertedColor", checked),
                        classNames: {
                            wrapper: "group-data-[selected=true]:bg-white bg-neutral-600"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white text-sm",
                            children: "Inverted Colors"
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$switch$2f$dist$2f$chunk$2d$I3A4XRYQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__switch_default__as__Switch$3e$__["Switch"], {
                        isSelected: rank.textShadow,
                        onValueChange: (checked)=>onUpdate(index, "textShadow", checked),
                        classNames: {
                            wrapper: "group-data-[selected=true]:bg-white bg-neutral-600"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white text-sm",
                            children: "Text Shadow"
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                label: "Glow Intensity (0-100)",
                type: "number",
                variant: "bordered",
                value: rank.glowIntensity.toString(),
                onValueChange: (value)=>onUpdate(index, "glowIntensity", Math.min(100, Math.max(0, parseInt(value) || 50))),
                classNames: inputClassNames
            }, void 0, false, {
                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                label: "Symbols Around Name (e.g., ◆ or ★★)",
                variant: "bordered",
                value: rank.symbolsAround || "",
                onValueChange: (value)=>onUpdate(index, "symbolsAround", value || null),
                placeholder: "Leave empty for no symbols",
                classNames: inputClassNames
            }, void 0, false, {
                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$select$2f$dist$2f$chunk$2d$C3QHEOC2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__select_default__as__Select$3e$__["Select"], {
                        label: "Animation Type",
                        variant: "bordered",
                        selectedKeys: [
                            rank.animationType
                        ],
                        onSelectionChange: (keys)=>{
                            const value = Array.from(keys)[0];
                            onUpdate(index, "animationType", value);
                        },
                        classNames: {
                            ...inputClassNames,
                            listboxWrapper: "bg-neutral-800",
                            popoverContent: "bg-neutral-800",
                            label: "text-white",
                            value: "text-white"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "None"
                            }, "none", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Shine"
                            }, "shine", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Pulse"
                            }, "pulse", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Shimmer"
                            }, "shimmer", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$select$2f$dist$2f$chunk$2d$C3QHEOC2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__select_default__as__Select$3e$__["Select"], {
                        label: "Card Style",
                        variant: "bordered",
                        selectedKeys: [
                            rank.cardStyle
                        ],
                        onSelectionChange: (keys)=>{
                            const value = Array.from(keys)[0];
                            onUpdate(index, "cardStyle", value);
                        },
                        classNames: {
                            ...inputClassNames,
                            listboxWrapper: "bg-neutral-800",
                            popoverContent: "bg-neutral-800",
                            label: "text-white",
                            value: "text-white"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Normal"
                            }, "normal", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Metallic"
                            }, "metallic", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Holographic"
                            }, "holographic", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Neon"
                            }, "neon", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$select$2f$dist$2f$chunk$2d$C3QHEOC2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__select_default__as__Select$3e$__["Select"], {
                        label: "Background Pattern",
                        variant: "bordered",
                        selectedKeys: [
                            rank.backgroundPattern
                        ],
                        onSelectionChange: (keys)=>{
                            const value = Array.from(keys)[0];
                            onUpdate(index, "backgroundPattern", value);
                        },
                        classNames: {
                            ...inputClassNames,
                            listboxWrapper: "bg-neutral-800",
                            popoverContent: "bg-neutral-800",
                            label: "text-white",
                            value: "text-white"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "None"
                            }, "none", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Dots"
                            }, "dots", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Grid"
                            }, "grid", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Diagonal"
                            }, "diagonal", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$select$2f$dist$2f$chunk$2d$C3QHEOC2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__select_default__as__Select$3e$__["Select"], {
                        label: "Font Size",
                        variant: "bordered",
                        selectedKeys: [
                            rank.fontSize
                        ],
                        onSelectionChange: (keys)=>{
                            const value = Array.from(keys)[0];
                            onUpdate(index, "fontSize", value);
                        },
                        classNames: {
                            ...inputClassNames,
                            listboxWrapper: "bg-neutral-800",
                            popoverContent: "bg-neutral-800",
                            label: "text-white",
                            value: "text-white"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Normal"
                            }, "normal", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Large"
                            }, "large", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Extra Large"
                            }, "xl", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$select$2f$dist$2f$chunk$2d$C3QHEOC2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__select_default__as__Select$3e$__["Select"], {
                        label: "Font Weight",
                        variant: "bordered",
                        selectedKeys: [
                            rank.fontWeight
                        ],
                        onSelectionChange: (keys)=>{
                            const value = Array.from(keys)[0];
                            onUpdate(index, "fontWeight", value);
                        },
                        classNames: {
                            ...inputClassNames,
                            listboxWrapper: "bg-neutral-800",
                            popoverContent: "bg-neutral-800",
                            label: "text-white",
                            value: "text-white"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Normal"
                            }, "normal", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Bold"
                            }, "bold", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$listbox$2f$dist$2f$chunk$2d$BJFJ4DRR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                children: "Black"
                            }, "black", false, {
                                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                                lineNumber: 223,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                    color: "danger",
                    variant: "flat",
                    onPress: ()=>onRemove(rank.id),
                    size: "sm",
                    children: "Remove Rank"
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                    lineNumber: 229,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
                lineNumber: 228,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/mappack-edit/RankEditor.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = RankEditor;
var _c;
__turbopack_context__.k.register(_c, "RankEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/mappack-edit/RanksTab.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "RanksTab": ()=>RanksTab
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/button/dist/chunk-WBUKVQRU.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$RankEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/mappack-edit/RankEditor.tsx [app-client] (ecmascript)");
;
;
;
function RanksTab(param) {
    let { ranks, onAdd, onUpdate, onRemove, inputClassNames } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-[auto_1fr] items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl font-ruigslay",
                        children: "Player Ranks"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/RanksTab.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 h-[5px] bg-neutral-300"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/RanksTab.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/RanksTab.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-400 mb-4",
                children: "Ranks are awarded to players based on their total points. Customize the appearance of each rank."
            }, void 0, false, {
                fileName: "[project]/src/app/_components/mappack-edit/RanksTab.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            ranks.map((rank, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$RankEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RankEditor"], {
                    rank: rank,
                    index: index,
                    onUpdate: onUpdate,
                    onRemove: onRemove,
                    inputClassNames: inputClassNames
                }, rank.id || "new-".concat(index), false, {
                    fileName: "[project]/src/app/_components/mappack-edit/RanksTab.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                color: "default",
                onPress: onAdd,
                children: "Add Rank"
            }, void 0, false, {
                fileName: "[project]/src/app/_components/mappack-edit/RanksTab.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/mappack-edit/RanksTab.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = RanksTab;
var _c;
__turbopack_context__.k.register(_c, "RanksTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "CollapsibleTrackItem": ()=>CollapsibleTrackItem
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/input/dist/chunk-SQIAVXJX.mjs [app-client] (ecmascript) <export input_default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$image$2f$dist$2f$chunk$2d$PGYMO5KK$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__image_default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/image/dist/chunk-PGYMO5KK.mjs [app-client] (ecmascript) <export image_default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/button/dist/chunk-WBUKVQRU.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$textConverter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/textConverter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function CollapsibleTrackItem(param) {
    let { track, timeGoals, timeInputValues, onTimeGoalChange, onMapStyleChange, onDelete, inputClassNames } = param;
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border border-gray-700 rounded-lg overflow-hidden bg-neutral-700",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 p-4 bg-neutral-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$image$2f$dist$2f$chunk$2d$PGYMO5KK$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__image_default__as__Image$3e$__["Image"], {
                        removeWrapper: true,
                        alt: "Track thumbnail",
                        className: "w-16 h-16 object-cover rounded flex-shrink-0",
                        src: track.track.thumbnailUrl
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-base text-white truncate",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$textConverter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormattedText"], {
                                    text: track.track.name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                                    lineNumber: 41,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-400",
                                children: [
                                    "by ",
                                    track.track.author
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                size: "sm",
                                color: "danger",
                                variant: "flat",
                                isIconOnly: true,
                                onPress: ()=>onDelete(track.track_id, track.track.name),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTrash"], {
                                    className: "w-3 h-3"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                size: "sm",
                                variant: "light",
                                isIconOnly: true,
                                onPress: ()=>setIsOpen(!isOpen),
                                className: "text-white",
                                children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChevronUp"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                                    lineNumber: 65,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChevronDown"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                                    lineNumber: 67,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                        label: "Map Style",
                        variant: "bordered",
                        value: track.mapStyle || "",
                        onValueChange: (value)=>onMapStyleChange(track.track_id, value),
                        classNames: inputClassNames
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-semibold text-white",
                                children: "Time Goals (format: minutes:seconds:milliseconds)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2",
                                children: timeGoals.filter((tg)=>tg.id).map((timeGoal)=>{
                                    var _timeInputValues_track_track_id;
                                    const inputValue = ((_timeInputValues_track_track_id = timeInputValues[track.track_id]) === null || _timeInputValues_track_track_id === void 0 ? void 0 : _timeInputValues_track_track_id[timeGoal.id]) || "";
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$input$2f$dist$2f$chunk$2d$SQIAVXJX$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                                        label: "".concat(timeGoal.name, " (×").concat(timeGoal.multiplier, ")"),
                                        placeholder: "1:03:942",
                                        variant: "bordered",
                                        value: inputValue,
                                        onValueChange: (value)=>onTimeGoalChange(track.track_id, timeGoal.id, value),
                                        classNames: inputClassNames,
                                        description: "Format: MM:SS:mmm"
                                    }, timeGoal.id, false, {
                                        fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                                        lineNumber: 95,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                                lineNumber: 88,
                                columnNumber: 13
                            }, this),
                            timeGoals.filter((tg)=>tg.id).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-400 italic",
                                children: "No time goals available. Create and save time goals first."
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                                lineNumber: 111,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
                lineNumber: 75,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_s(CollapsibleTrackItem, "+sus0Lb0ewKHdwiUhiTAJFoFyQ0=");
_c = CollapsibleTrackItem;
var _c;
__turbopack_context__.k.register(_c, "CollapsibleTrackItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/mappack-edit/TrackTimesTab.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// components/mappack-edit/TrackTimesTab.tsx
__turbopack_context__.s({
    "TrackTimesTab": ()=>TrackTimesTab
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$time$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/time.utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$CollapsibleTrackItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/mappack-edit/CollapsibleTrackItem.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function TrackTimesTab(param) {
    let { tracks, timeGoals, timeInputValues, onUpdateTrackTime, onUpdateMapStyle, onDeleteTrack, inputClassNames } = param;
    _s();
    // Initialize time input values from existing data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TrackTimesTab.useEffect": ()=>{
            tracks.forEach({
                "TrackTimesTab.useEffect": (track)=>{
                    var _track_timeGoalMappackTrack;
                    (_track_timeGoalMappackTrack = track.timeGoalMappackTrack) === null || _track_timeGoalMappackTrack === void 0 ? void 0 : _track_timeGoalMappackTrack.forEach({
                        "TrackTimesTab.useEffect": (tgmt)=>{
                            var _timeInputValues_track_track_id;
                            if (tgmt.time && !((_timeInputValues_track_track_id = timeInputValues[track.track_id]) === null || _timeInputValues_track_track_id === void 0 ? void 0 : _timeInputValues_track_track_id[tgmt.time_goal_id])) {
                                const timeString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$time$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["millisecondsToTimeString"])(tgmt.time);
                                onUpdateTrackTime(track.track_id, tgmt.time_goal_id, timeString);
                            }
                        }
                    }["TrackTimesTab.useEffect"]);
                }
            }["TrackTimesTab.useEffect"]);
        }
    }["TrackTimesTab.useEffect"], [
        tracks
    ]); // Only run when tracks change
    const timeGoalIds = timeGoals.filter((tg)=>tg.id).map((tg)=>tg.id);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-[auto_1fr] items-center gap-2 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl font-ruigslay",
                        children: "Track Time Goals"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/TrackTimesTab.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 h-[5px] bg-neutral-300"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/TrackTimesTab.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/mappack-edit/TrackTimesTab.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            tracks.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400 italic text-center py-8",
                children: "No tracks in this mappack."
            }, void 0, false, {
                fileName: "[project]/src/app/_components/mappack-edit/TrackTimesTab.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: tracks.map((track)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$CollapsibleTrackItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleTrackItem"], {
                        track: track,
                        timeGoals: timeGoals,
                        timeInputValues: timeInputValues,
                        onTimeGoalChange: onUpdateTrackTime,
                        onMapStyleChange: onUpdateMapStyle,
                        onDelete: onDeleteTrack,
                        inputClassNames: inputClassNames
                    }, track.track_id, false, {
                        fileName: "[project]/src/app/_components/mappack-edit/TrackTimesTab.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/_components/mappack-edit/TrackTimesTab.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/mappack-edit/TrackTimesTab.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(TrackTimesTab, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = TrackTimesTab;
var _c;
__turbopack_context__.k.register(_c, "TrackTimesTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/EditMappackModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "EditMappackModal": ()=>EditMappackModal
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$TW2E3XVA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_default__as__Modal$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-TW2E3XVA.mjs [app-client] (ecmascript) <export modal_default as Modal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$NWAOTABO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_content_default__as__ModalContent$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-NWAOTABO.mjs [app-client] (ecmascript) <export modal_content_default as ModalContent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$R7OT77UN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_header_default__as__ModalHeader$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-R7OT77UN.mjs [app-client] (ecmascript) <export modal_header_default as ModalHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$HNQZEMGR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_body_default__as__ModalBody$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-HNQZEMGR.mjs [app-client] (ecmascript) <export modal_body_default as ModalBody>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$5LXTSPS7$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_footer_default__as__ModalFooter$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/modal/dist/chunk-5LXTSPS7.mjs [app-client] (ecmascript) <export modal_footer_default as ModalFooter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/button/dist/chunk-WBUKVQRU.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$RRHVXFLZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tabs_default__as__Tabs$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/tabs/dist/chunk-RRHVXFLZ.mjs [app-client] (ecmascript) <export tabs_default as Tabs>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/tabs/dist/chunk-ML27DD5T.mjs [app-client] (ecmascript) <export tab_item_base_default as Tab>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEditMappack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useEditMappack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mappack$2d$edit$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/mappack-edit.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/ConfirmDialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$BasicInfoTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/mappack-edit/BasicInfoTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$TimeGoalsTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/mappack-edit/TimeGoalsTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$TiersTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/mappack-edit/TiersTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$RanksTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/mappack-edit/RanksTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$TrackTimesTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/mappack-edit/TrackTimesTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/modal-styles.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
function EditMappackModal(param) {
    let { mappack, onSave, isOpen, onClose } = param;
    _s();
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmDialog, setConfirmDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { editData, setEditData, timeInputValues, addTimeGoal, updateTimeGoal, removeTimeGoalFromState, addTier, updateTier, removeTierFromState, addRank, updateRank, removeRankFromState, assignTierToTrack, updateTrackTime, updateMapStyle, removeTrackFromState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEditMappack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEditMappack"])(mappack, isOpen);
    if (!editData) {
        return null;
    }
    const handleSave = async ()=>{
        setIsSaving(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mappack$2d$edit$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mappackEditService"].updateMappack(editData);
            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving mappack:", error);
            alert("Failed to save mappack: ".concat(error instanceof Error ? error.message : "Unknown error"));
        } finally{
            setIsSaving(false);
        }
    };
    const handleRemoveTimeGoal = async (id)=>{
        if (!id) {
            removeTimeGoalFromState(id);
            return;
        }
        setConfirmDialog({
            isOpen: true,
            title: "Delete Time Goal",
            message: "This will permanently delete this time goal and all associated player achievements. This action cannot be undone.",
            onConfirm: async ()=>{
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mappack$2d$edit$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mappackEditService"].deleteTimeGoal(editData.id, id);
                    removeTimeGoalFromState(id);
                } catch (error) {
                    console.error("Error deleting time goal:", error);
                    alert("Failed to delete time goal");
                }
            }
        });
    };
    const handleRemoveTier = async (id)=>{
        if (!id) {
            removeTierFromState(id);
            return;
        }
        setConfirmDialog({
            isOpen: true,
            title: "Delete Tier",
            message: "This will remove this tier. Tracks assigned to this tier will become unranked.",
            onConfirm: async ()=>{
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mappack$2d$edit$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mappackEditService"].deleteTier(editData.id, id);
                    removeTierFromState(id);
                } catch (error) {
                    console.error("Error deleting tier:", error);
                    alert("Failed to delete tier");
                }
            }
        });
    };
    const handleRemoveRank = async (id)=>{
        if (!id) {
            removeRankFromState(id);
            return;
        }
        setConfirmDialog({
            isOpen: true,
            title: "Delete Rank",
            message: "This will permanently delete this rank. Players with this rank will be re-assigned based on their points.",
            onConfirm: async ()=>{
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mappack$2d$edit$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mappackEditService"].deleteRank(editData.id, id);
                    removeRankFromState(id);
                } catch (error) {
                    console.error("Error deleting rank:", error);
                    alert("Failed to delete rank");
                }
            }
        });
    };
    const handleDeleteTrack = (trackId, trackName)=>{
        setConfirmDialog({
            isOpen: true,
            title: "Delete Track",
            message: 'Are you sure you want to remove "'.concat(trackName, '" from this mappack? This will delete all time goals and tier assignments for this track.'),
            onConfirm: async ()=>{
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mappack$2d$edit$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mappackEditService"].deleteTrack(editData.id, trackId);
                    removeTrackFromState(trackId);
                } catch (error) {
                    console.error("Error deleting track:", error);
                    alert("Failed to delete track");
                }
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$TW2E3XVA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_default__as__Modal$3e$__["Modal"], {
                isOpen: isOpen,
                onOpenChange: onClose,
                placement: "top-center",
                size: "5xl",
                scrollBehavior: "inside",
                classNames: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODAL_CLASSNAMES"],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$NWAOTABO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_content_default__as__ModalContent$3e$__["ModalContent"], {
                    children: (onClose)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$R7OT77UN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_header_default__as__ModalHeader$3e$__["ModalHeader"], {
                                    className: "flex flex-col gap-1 text-4xl font-ruigslay items-center",
                                    children: "Edit Mappack"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                    lineNumber: 182,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$HNQZEMGR$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_body_default__as__ModalBody$3e$__["ModalBody"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$RRHVXFLZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tabs_default__as__Tabs$3e$__["Tabs"], {
                                        classNames: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TAB_CLASSNAMES"],
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__["Tab"], {
                                                title: "Basic Info",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$BasicInfoTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BasicInfoTab"], {
                                                    editData: editData,
                                                    onUpdate: (updates)=>setEditData({
                                                            ...editData,
                                                            ...updates
                                                        }),
                                                    inputClassNames: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODAL_INPUT_CLASSNAMES"]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                                    lineNumber: 188,
                                                    columnNumber: 21
                                                }, this)
                                            }, "basic", false, {
                                                fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                                lineNumber: 187,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__["Tab"], {
                                                title: "Time Goals",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$TimeGoalsTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimeGoalsTab"], {
                                                    timeGoals: editData.timeGoals,
                                                    onAdd: addTimeGoal,
                                                    onUpdate: updateTimeGoal,
                                                    onRemove: handleRemoveTimeGoal,
                                                    inputClassNames: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODAL_INPUT_CLASSNAMES"]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 21
                                                }, this)
                                            }, "timegoals", false, {
                                                fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                                lineNumber: 195,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__["Tab"], {
                                                title: "Tiers",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$TiersTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TiersTab"], {
                                                    tiers: editData.mappackTiers,
                                                    tracks: editData.MappackTrack,
                                                    onAddTier: addTier,
                                                    onUpdateTier: updateTier,
                                                    onRemoveTier: handleRemoveTier,
                                                    onAssignTier: assignTierToTrack,
                                                    inputClassNames: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODAL_INPUT_CLASSNAMES"]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                                    lineNumber: 206,
                                                    columnNumber: 21
                                                }, this)
                                            }, "tiers", false, {
                                                fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                                lineNumber: 205,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__["Tab"], {
                                                title: "Ranks",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$RanksTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RanksTab"], {
                                                    ranks: editData.mappackRanks,
                                                    onAdd: addRank,
                                                    onUpdate: updateRank,
                                                    onRemove: handleRemoveRank,
                                                    inputClassNames: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODAL_INPUT_CLASSNAMES"]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 21
                                                }, this)
                                            }, "ranks", false, {
                                                fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                                lineNumber: 217,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__["Tab"], {
                                                title: "Track Times",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$mappack$2d$edit$2f$TrackTimesTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrackTimesTab"], {
                                                    tracks: editData.MappackTrack,
                                                    timeGoals: editData.timeGoals,
                                                    timeInputValues: timeInputValues,
                                                    onUpdateTrackTime: updateTrackTime,
                                                    onUpdateMapStyle: updateMapStyle,
                                                    onDeleteTrack: handleDeleteTrack,
                                                    inputClassNames: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$modal$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODAL_INPUT_CLASSNAMES"]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                                    lineNumber: 228,
                                                    columnNumber: 21
                                                }, this)
                                            }, "tracks", false, {
                                                fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                                lineNumber: 227,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                        lineNumber: 186,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                    lineNumber: 185,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$modal$2f$dist$2f$chunk$2d$5LXTSPS7$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__modal_footer_default__as__ModalFooter$3e$__["ModalFooter"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                            color: "default",
                                            variant: "bordered",
                                            onPress: onClose,
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                            lineNumber: 241,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                            color: "default",
                                            onPress: handleSave,
                                            isLoading: isSaving,
                                            children: "Save All Changes"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                            lineNumber: 244,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                                    lineNumber: 240,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            confirmDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                isOpen: confirmDialog.isOpen,
                onClose: ()=>setConfirmDialog(null),
                onConfirm: confirmDialog.onConfirm,
                title: confirmDialog.title,
                message: confirmDialog.message,
                confirmText: "Delete",
                cancelText: "Cancel",
                isDangerous: true
            }, void 0, false, {
                fileName: "[project]/src/app/_components/EditMappackModal.tsx",
                lineNumber: 254,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(EditMappackModal, "sMmcLvNkPkxyKyVEB2PIr53nJ9M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEditMappack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEditMappack"]
    ];
});
_c = EditMappackModal;
var _c;
__turbopack_context__.k.register(_c, "EditMappackModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/RequireRole.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>RequireRole
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function RequireRole(param) {
    let { role, children, fallback = null } = param;
    _s();
    const { user, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    if (!isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: fallback
        }, void 0, false);
    }
    if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    if ((user === null || user === void 0 ? void 0 : user.role) === role) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: fallback
    }, void 0, false);
}
_s(RequireRole, "ZciNvz1w38ujgxJkc4IsNEDLTNc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = RequireRole;
var _c;
__turbopack_context__.k.register(_c, "RequireRole");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/MappackSidebar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "MappackSidebar": ()=>MappackSidebar
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/button/dist/chunk-WBUKVQRU.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$AddTrackModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/AddTrackModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$EditMappackModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/EditMappackModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$RequireRole$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/RequireRole.tsx [app-client] (ecmascript)");
;
;
;
;
;
function MappackSidebar(param) {
    let { mappack, sortedTiers, tracksByTier, activeTier, selectedTab, isEditOpen, onTierClick, onEditClick, onEditClose, onEditSave } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white-900 lg:sticky lg:top-4 lg:self-start",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4 p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center items-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-bold text-3xl font-ruigslay overline",
                        children: mappack.name.toUpperCase()
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center items-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-bold text-sm",
                        children: mappack.description
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {}, void 0, false, {
                    fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center items-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg font-ruigslay",
                        children: "Timegoals"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this),
                mappack.timeGoals.map((timeGoal)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-bold",
                            children: timeGoal.name
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                            lineNumber: 52,
                            columnNumber: 13
                        }, this)
                    }, timeGoal.name, false, {
                        fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this)),
                selectedTab === "maps" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-gray-700 pt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold text-lg mb-2 text-center font-ruigslay",
                                    children: "Tiers"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this),
                                sortedTiers.map((tierName)=>{
                                    var _tierData_tier;
                                    const tierData = tracksByTier[tierName];
                                    const tierColor = ((_tierData_tier = tierData.tier) === null || _tierData_tier === void 0 ? void 0 : _tierData_tier.color) || "#6b7280";
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onTierClick(tierName),
                                        style: {
                                            backgroundColor: activeTier === tierName ? tierColor : "transparent"
                                        },
                                        className: "w-full py-2 px-4 rounded-lg transition-all duration-200 ".concat(activeTier === tierName ? "text-white font-semibold" : "text-gray-300 hover:opacity-80"),
                                        children: [
                                            tierName.toUpperCase(),
                                            " TIER (",
                                            tierData.tracks.length,
                                            ")"
                                        ]
                                    }, tierName, true, {
                                        fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                                        lineNumber: 67,
                                        columnNumber: 19
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center items-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$RequireRole$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                role: "admin",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$AddTrackModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    timegoals: mappack.timeGoals,
                                    mappackId: mappack.id,
                                    tiers: mappack.mappackTiers
                                }, void 0, false, {
                                    fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                                    lineNumber: 88,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                                lineNumber: 87,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                            lineNumber: 86,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center items-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$RequireRole$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        role: "admin",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                onPress: onEditClick,
                                children: "Edit Mappack"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$EditMappackModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditMappackModal"], {
                                mappack: mappack,
                                isOpen: isEditOpen,
                                onClose: onEditClose,
                                onSave: onEditSave
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/MappackSidebar.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/_components/MappackSidebar.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/_components/MappackSidebar.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c = MappackSidebar;
var _c;
__turbopack_context__.k.register(_c, "MappackSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/track-filter.utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "filterTracksByTimeGoal": ()=>filterTracksByTimeGoal,
    "getNotAchievedCount": ()=>getNotAchievedCount
});
function filterTracksByTimeGoal(tracks, timeGoalId) {
    if (timeGoalId === null) {
        return tracks;
    }
    return tracks.filter((track)=>{
        var _track_timeGoalMappackTrack;
        const timeGoalStatus = (_track_timeGoalMappackTrack = track.timeGoalMappackTrack) === null || _track_timeGoalMappackTrack === void 0 ? void 0 : _track_timeGoalMappackTrack.find((tg)=>tg.time_goal_id === timeGoalId);
        return (timeGoalStatus === null || timeGoalStatus === void 0 ? void 0 : timeGoalStatus.is_achieved) !== true;
    });
}
function getNotAchievedCount(tracks, timeGoalId) {
    return tracks.filter((track)=>{
        var _track_timeGoalMappackTrack;
        const goals = (_track_timeGoalMappackTrack = track.timeGoalMappackTrack) !== null && _track_timeGoalMappackTrack !== void 0 ? _track_timeGoalMappackTrack : [];
        const tg = goals.find((t)=>t.time_goal_id === timeGoalId);
        return !tg || tg.is_achieved !== true;
    }).length;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/useTrackFilter.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useTrackFilter": ()=>useTrackFilter
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$track$2d$filter$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/track-filter.utils.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useTrackFilter(tracks, onFilterChange) {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedTimeGoal, setSelectedTimeGoal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const applyFilter = ()=>{
        const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$track$2d$filter$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterTracksByTimeGoal"])(tracks, selectedTimeGoal);
        onFilterChange(filtered);
        setIsOpen(false);
    };
    const clearFilter = ()=>{
        setSelectedTimeGoal(null);
        onFilterChange(tracks);
        setIsOpen(false);
    };
    const toggleTimeGoal = (timeGoalId)=>{
        setSelectedTimeGoal(selectedTimeGoal === timeGoalId ? null : timeGoalId);
    };
    return {
        isOpen,
        setIsOpen,
        selectedTimeGoal,
        applyFilter,
        clearFilter,
        toggleTimeGoal,
        isFilterActive: selectedTimeGoal !== null
    };
}
_s(useTrackFilter, "nNzt7UDNrEGrHZs6gu/7hi2whKU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/track-filter/TimeGoalOption.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TimeGoalOption": ()=>TimeGoalOption
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$chip$2f$dist$2f$chunk$2d$EIRINNCE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/chip/dist/chunk-EIRINNCE.mjs [app-client] (ecmascript) <export chip_default as Chip>");
;
;
function TimeGoalOption(param) {
    let { timeGoal, notAchievedCount, isSelected, onClick } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "\n        p-3 rounded-lg border transition-all text-left\n        ".concat(isSelected ? "bg-orange-500/20 border-orange-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/70", "\n      "),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-1.5 flex-1 min-w-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-semibold truncate",
                            children: timeGoal.name
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/track-filter/TimeGoalOption.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$chip$2f$dist$2f$chunk$2d$EIRINNCE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__["Chip"], {
                                    size: "sm",
                                    className: "bg-zinc-700 text-zinc-400 text-xs",
                                    children: [
                                        "×",
                                        timeGoal.multiplier
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/_components/track-filter/TimeGoalOption.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$chip$2f$dist$2f$chunk$2d$EIRINNCE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__["Chip"], {
                                    size: "sm",
                                    className: "text-xs ".concat(notAchievedCount === 0 ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"),
                                    children: [
                                        notAchievedCount,
                                        " left"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/_components/track-filter/TimeGoalOption.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/_components/track-filter/TimeGoalOption.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/_components/track-filter/TimeGoalOption.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-5 h-5 text-orange-400",
                        fill: "currentColor",
                        viewBox: "0 0 20 20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            fillRule: "evenodd",
                            d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                            clipRule: "evenodd"
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/track-filter/TimeGoalOption.tsx",
                            lineNumber: 58,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/track-filter/TimeGoalOption.tsx",
                        lineNumber: 53,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/track-filter/TimeGoalOption.tsx",
                    lineNumber: 52,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/_components/track-filter/TimeGoalOption.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/_components/track-filter/TimeGoalOption.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_c = TimeGoalOption;
var _c;
__turbopack_context__.k.register(_c, "TimeGoalOption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/track-filter/FilterPopoverContent.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// components/track-filter/FilterPopoverContent.tsx
__turbopack_context__.s({
    "FilterPopoverContent": ()=>FilterPopoverContent
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/button/dist/chunk-WBUKVQRU.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$track$2d$filter$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/track-filter.utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$track$2d$filter$2f$TimeGoalOption$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/track-filter/TimeGoalOption.tsx [app-client] (ecmascript)");
;
;
;
;
function FilterPopoverContent(param) {
    let { timeGoals, tracks, selectedTimeGoal, onToggleTimeGoal, onApply, onClear } = param;
    // Sort time goals by multiplier (highest first)
    const sortedTimeGoals = [
        ...timeGoals
    ].sort((a, b)=>b.multiplier - a.multiplier);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-[400px] max-w-[90vw]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-3 border-b border-zinc-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-base font-bold text-white",
                        children: "Filter Tracks"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/track-filter/FilterPopoverContent.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-zinc-500 mt-1",
                        children: "Show only unachieved time goals"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/track-filter/FilterPopoverContent.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/track-filter/FilterPopoverContent.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 space-y-3 max-h-[60vh] overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-zinc-400 font-semibold uppercase tracking-wider",
                        children: "Select Time Goal"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/track-filter/FilterPopoverContent.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: sortedTimeGoals.map((timeGoal)=>{
                            const notAchieved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$track$2d$filter$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotAchievedCount"])(tracks, timeGoal.id);
                            const isSelected = selectedTimeGoal === timeGoal.id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$track$2d$filter$2f$TimeGoalOption$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimeGoalOption"], {
                                timeGoal: timeGoal,
                                notAchievedCount: notAchieved,
                                isSelected: isSelected,
                                onClick: ()=>onToggleTimeGoal(timeGoal.id)
                            }, timeGoal.id, false, {
                                fileName: "[project]/src/app/_components/track-filter/FilterPopoverContent.tsx",
                                lineNumber: 48,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/track-filter/FilterPopoverContent.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/track-filter/FilterPopoverContent.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-3 border-t border-zinc-800 flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                        size: "sm",
                        variant: "light",
                        onPress: onClear,
                        className: "text-zinc-400 hover:text-white",
                        children: "Clear"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/track-filter/FilterPopoverContent.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                        size: "sm",
                        onPress: onApply,
                        className: "bg-orange-500 hover:bg-orange-600 text-white",
                        isDisabled: selectedTimeGoal === null,
                        children: "Apply Filter"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/track-filter/FilterPopoverContent.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/track-filter/FilterPopoverContent.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/track-filter/FilterPopoverContent.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_c = FilterPopoverContent;
var _c;
__turbopack_context__.k.register(_c, "FilterPopoverContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/constants/filter-popover-styles.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "FILTER_POPOVER_CLASSNAMES": ()=>FILTER_POPOVER_CLASSNAMES,
    "getFilterButtonClassName": ()=>getFilterButtonClassName
});
const FILTER_POPOVER_CLASSNAMES = {
    base: "bg-zinc-900 border border-zinc-800",
    content: "bg-zinc-900 p-0"
};
const getFilterButtonClassName = (isActive)=>"\n  w-9 h-9 p-0 min-w-0 flex items-center justify-center\n  ".concat(isActive ? "bg-orange-500/20 text-orange-400 border border-orange-500/50" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600", "\n");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/TrackFilter.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>TrackFilter
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$popover$2f$dist$2f$chunk$2d$AT5AFJ6L$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__popover_default__as__Popover$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/popover/dist/chunk-AT5AFJ6L.mjs [app-client] (ecmascript) <export popover_default as Popover>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$popover$2f$dist$2f$chunk$2d$6FXDB7ZT$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__popover_trigger_default__as__PopoverTrigger$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/popover/dist/chunk-6FXDB7ZT.mjs [app-client] (ecmascript) <export popover_trigger_default as PopoverTrigger>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$popover$2f$dist$2f$chunk$2d$Z57F4COC$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__popover_content_default__as__PopoverContent$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/popover/dist/chunk-Z57F4COC.mjs [app-client] (ecmascript) <export popover_content_default as PopoverContent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/button/dist/chunk-WBUKVQRU.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTrackFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useTrackFilter.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$track$2d$filter$2f$FilterPopoverContent$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/track-filter/FilterPopoverContent.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$filter$2d$popover$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/filter-popover-styles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa6$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa6/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function TrackFilter(param) {
    let { timeGoals, tracks, onFilterChange } = param;
    _s();
    const { isOpen, setIsOpen, selectedTimeGoal, applyFilter, clearFilter, toggleTimeGoal, isFilterActive } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTrackFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTrackFilter"])(tracks, onFilterChange);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$popover$2f$dist$2f$chunk$2d$AT5AFJ6L$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__popover_default__as__Popover$3e$__["Popover"], {
        isOpen: isOpen,
        onOpenChange: setIsOpen,
        placement: "bottom-start",
        classNames: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$filter$2d$popover$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILTER_POPOVER_CLASSNAMES"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$popover$2f$dist$2f$chunk$2d$6FXDB7ZT$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__popover_trigger_default__as__PopoverTrigger$3e$__["PopoverTrigger"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$button$2f$dist$2f$chunk$2d$WBUKVQRU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                    size: "sm",
                    variant: "flat",
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$filter$2d$popover$2d$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilterButtonClassName"])(isFilterActive),
                    startContent: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa6$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFilter"], {}, void 0, false, {
                        fileName: "[project]/src/app/_components/TrackFilter.tsx",
                        lineNumber: 42,
                        columnNumber: 25
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/TrackFilter.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/_components/TrackFilter.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$popover$2f$dist$2f$chunk$2d$Z57F4COC$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__popover_content_default__as__PopoverContent$3e$__["PopoverContent"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$track$2d$filter$2f$FilterPopoverContent$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterPopoverContent"], {
                    timeGoals: timeGoals,
                    tracks: tracks,
                    selectedTimeGoal: selectedTimeGoal,
                    onToggleTimeGoal: toggleTimeGoal,
                    onApply: applyFilter,
                    onClear: clearFilter
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/TrackFilter.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/_components/TrackFilter.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/TrackFilter.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_s(TrackFilter, "iqrxrcWBRS1B9GlPD1+xTW/QyWI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTrackFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTrackFilter"]
    ];
});
_c = TrackFilter;
var _c;
__turbopack_context__.k.register(_c, "TrackFilter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/LeaderboardTab.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>LeaderboardTab
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$spinner$2f$dist$2f$chunk$2d$S6CZL5JF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__spinner_default__as__Spinner$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/spinner/dist/chunk-S6CZL5JF.mjs [app-client] (ecmascript) <export spinner_default as Spinner>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$fonts$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/fonts/index.ts [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$fonts$2f$casko_d507dd9$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Casko$3e$__ = __turbopack_context__.i("[project]/src/fonts/casko_d507dd9.js [app-client] (ecmascript) <export default as Casko>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const getPlayerRank = (points, ranks)=>{
    const sortedRanks = [
        ...ranks
    ].sort((a, b)=>b.pointsNeeded - a.pointsNeeded);
    for (const rank of sortedRanks){
        if (points >= rank.pointsNeeded) {
            return rank;
        }
    }
    return sortedRanks[sortedRanks.length - 1] || null;
};
// Get animation CSS class based on type
const getAnimationClass = (animationType)=>{
    switch(animationType){
        case "shine":
            return "animate-shine";
        case "pulse":
            return "animate-pulse";
        case "shimmer":
            return "animate-shimmer";
        default:
            return "";
    }
};
// Get background pattern SVG
const getBackgroundPattern = (pattern, color)=>{
    switch(pattern){
        case "dots":
            return "radial-gradient(circle, ".concat(color, "30 1px, transparent 1px)");
        case "grid":
            return "linear-gradient(".concat(color, "20 1px, transparent 1px), linear-gradient(90deg, ").concat(color, "20 1px, transparent 1px)");
        case "diagonal":
            return "repeating-linear-gradient(45deg, transparent, transparent 10px, ".concat(color, "15 10px, ").concat(color, "15 20px)");
        default:
            return "none";
    }
};
// Get card style effects
const getCardStyleEffects = (cardStyle, color)=>{
    switch(cardStyle){
        case "metallic":
            return {
                background: "linear-gradient(135deg, ".concat(color, "dd 0%, ").concat(color, "aa 50%, ").concat(color, "dd 100%)"),
                filter: "brightness(1.1) contrast(1.1)"
            };
        case "holographic":
            return {
                background: "linear-gradient(135deg, ".concat(color, "dd, ").concat(color, "88, ").concat(color, "dd)"),
                backgroundSize: "200% 200%",
                animation: "holographic 3s ease infinite"
            };
        case "neon":
            return {
                background: "".concat(color, "20"),
                border: "2px solid ".concat(color),
                boxShadow: "0 0 20px ".concat(color, ", inset 0 0 20px ").concat(color, "40")
            };
        default:
            return {};
    }
};
const getFontSizeClass = (fontSize)=>{
    switch(fontSize){
        case "large":
            return "text-xl";
        case "xl":
            return "text-2xl";
        default:
            return "text-lg";
    }
};
const getFontWeightClass = (fontWeight)=>{
    switch(fontWeight){
        case "bold":
            return "font-bold";
        case "black":
            return "font-black";
        default:
            return "font-semibold";
    }
};
function LeaderboardTab(param) {
    let { mappackId, mappackRanks } = param;
    _s();
    const [leaderboard, setLeaderboard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeRank, setActiveRank] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const rankRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const API_BASE = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeaderboardTab.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("".concat(API_BASE, "/mappacks/").concat(mappackId, "/leaderboard?limit=100")).then({
                "LeaderboardTab.useEffect": (response)=>{
                    setLeaderboard(response.data);
                    setLoading(false);
                }
            }["LeaderboardTab.useEffect"]).catch({
                "LeaderboardTab.useEffect": (err)=>{
                    console.log("Error fetching leaderboard:", err);
                    setLoading(false);
                }
            }["LeaderboardTab.useEffect"]);
        }
    }["LeaderboardTab.useEffect"], [
        mappackId
    ]);
    // Group players by rank
    const playersByRank = leaderboard.reduce((acc, entry)=>{
        const rank = getPlayerRank(entry.total_points, mappackRanks);
        const rankName = (rank === null || rank === void 0 ? void 0 : rank.name) || "Unranked";
        if (!acc[rankName]) {
            acc[rankName] = {
                rank: rank,
                players: []
            };
        }
        acc[rankName].players.push(entry);
        return acc;
    }, {});
    // Sort ranks by points needed (descending)
    const sortedRanks = Object.keys(playersByRank).sort((a, b)=>{
        var _playersByRank_a_rank, _playersByRank_b_rank;
        const pointsA = ((_playersByRank_a_rank = playersByRank[a].rank) === null || _playersByRank_a_rank === void 0 ? void 0 : _playersByRank_a_rank.pointsNeeded) || 0;
        const pointsB = ((_playersByRank_b_rank = playersByRank[b].rank) === null || _playersByRank_b_rank === void 0 ? void 0 : _playersByRank_b_rank.pointsNeeded) || 0;
        return pointsB - pointsA;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeaderboardTab.useEffect": ()=>{
            const observer = new IntersectionObserver({
                "LeaderboardTab.useEffect": (entries)=>{
                    entries.forEach({
                        "LeaderboardTab.useEffect": (entry)=>{
                            if (entry.isIntersecting) {
                                setActiveRank(entry.target.getAttribute("data-rank") || "");
                            }
                        }
                    }["LeaderboardTab.useEffect"]);
                }
            }["LeaderboardTab.useEffect"], {
                threshold: 0.5,
                rootMargin: "-20% 0px -20% 0px"
            });
            Object.values(rankRefs.current).forEach({
                "LeaderboardTab.useEffect": (ref)=>{
                    if (ref) observer.observe(ref);
                }
            }["LeaderboardTab.useEffect"]);
            return ({
                "LeaderboardTab.useEffect": ()=>observer.disconnect()
            })["LeaderboardTab.useEffect"];
        }
    }["LeaderboardTab.useEffect"], [
        playersByRank
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center h-96",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$spinner$2f$dist$2f$chunk$2d$S6CZL5JF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__spinner_default__as__Spinner$3e$__["Spinner"], {
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                lineNumber: 167,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
            lineNumber: 166,
            columnNumber: 7
        }, this);
    }
    if (leaderboard.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center h-96",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white/50 text-lg",
                        children: "No players yet"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                        lineNumber: 176,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white/30 text-sm mt-2",
                        children: "Complete tracks to appear on the leaderboard"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                        lineNumber: 177,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                lineNumber: 175,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
            lineNumber: 174,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-139433002f4e90f1" + " " + "flex flex-col gap-8",
        children: [
            sortedRanks.map((rankName)=>{
                const rankData = playersByRank[rankName];
                const rank = rankData.rank;
                if (!rank) return null;
                const rankColor = rank.color || "#6b7280";
                const borderColorToUse = rank.borderColor || rankColor;
                const glowOpacity = Math.min(100, Math.max(0, rank.glowIntensity || 50)) / 100;
                let globalPosition = 0;
                // Calculate starting position for this rank
                for (const r of sortedRanks){
                    if (r === rankName) break;
                    globalPosition += playersByRank[r].players.length;
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: (el)=>{
                        rankRefs.current[rankName] = el;
                    },
                    "data-rank": rankName,
                    className: "jsx-139433002f4e90f1" + " " + "scroll-mt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-139433002f4e90f1" + " " + "mb-6 pt-4 justify-center items-center flex",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-139433002f4e90f1" + " " + "relative",
                                children: [
                                    rank.backgroundGlow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            backgroundColor: rankColor,
                                            opacity: glowOpacity * 0.5
                                        },
                                        className: "jsx-139433002f4e90f1" + " " + "absolute inset-0 blur-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                        lineNumber: 216,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            color: rankColor,
                                            textShadow: rank.textShadow ? "0 0 20px ".concat(rankColor).concat(Math.round(glowOpacity * 128).toString(16).padStart(2, '0')) : 'none'
                                        },
                                        className: "jsx-139433002f4e90f1" + " " + "text-4xl justify-center ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$fonts$2f$casko_d507dd9$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Casko$3e$__["Casko"].className, " relative"),
                                        children: [
                                            rank.symbolsAround,
                                            " ",
                                            rankName.toUpperCase(),
                                            " ",
                                            rank.symbolsAround
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                        lineNumber: 224,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                lineNumber: 214,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                            lineNumber: 213,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-139433002f4e90f1" + " " + "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
                            children: rankData.players.map((entry, index)=>{
                                const position = globalPosition + index + 1;
                                const isTopThree = position <= 3;
                                const cardStyleEffects = getCardStyleEffects(rank.cardStyle, rankColor);
                                const animationClass = getAnimationClass(rank.animationType);
                                const patternBg = getBackgroundPattern(rank.backgroundPattern, rankColor);
                                const fontSizeClass = getFontSizeClass(rank.fontSize);
                                const fontWeightClass = getFontWeightClass(rank.fontWeight);
                                // INVERTED COLOR STYLE
                                if (rank.invertedColor) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: cardStyleEffects.background || "linear-gradient(135deg, ".concat(rankColor, "dd, ").concat(rankColor, "aa)"),
                                            border: "".concat(rank.borderWidth || 2, "px solid ").concat(borderColorToUse),
                                            boxShadow: rank.backgroundGlow ? "0 0 ".concat(20 * glowOpacity, "px ").concat(rankColor).concat(Math.round(glowOpacity * 96).toString(16).padStart(2, '0')) : 'none',
                                            backgroundImage: patternBg,
                                            backgroundSize: rank.backgroundPattern === "dots" ? "20px 20px" : rank.backgroundPattern === "grid" ? "20px 20px" : "auto",
                                            filter: cardStyleEffects.filter,
                                            animation: cardStyleEffects.animation
                                        },
                                        className: "jsx-139433002f4e90f1" + " " + "relative p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden ".concat(animationClass),
                                        children: [
                                            rank.animationType === "shine" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    background: "linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)"
                                                },
                                                className: "jsx-139433002f4e90f1" + " " + "absolute inset-0 opacity-30 animate-shine-move"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                lineNumber: 266,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-139433002f4e90f1" + " " + "absolute top-2 right-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: "".concat(rankColor, "20")
                                                    },
                                                    className: "jsx-139433002f4e90f1" + " " + "text-xs font-mono font-bold",
                                                    children: [
                                                        "#",
                                                        position
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                lineNumber: 275,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-139433002f4e90f1" + " " + "flex items-center gap-4 relative z-10",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-139433002f4e90f1" + " " + "flex-shrink-0 text-left",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    color: '#000000',
                                                                    textShadow: rank.textShadow ? "0 0 10px ".concat(rankColor) : 'none'
                                                                },
                                                                className: "jsx-139433002f4e90f1" + " " + "font-bold text-2xl font-mono leading-none",
                                                                children: entry.total_points
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                                lineNumber: 287,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-139433002f4e90f1" + " " + "text-xs uppercase tracking-wider mt-1 text-black/60",
                                                                children: "pts"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                                lineNumber: 296,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                        lineNumber: 286,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-139433002f4e90f1" + " " + "flex-1 min-w-0 pr-6",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                color: '#000000',
                                                                textShadow: rank.textShadow ? "0 0 10px ".concat(rankColor, "40") : 'none'
                                                            },
                                                            className: "jsx-139433002f4e90f1" + " " + "".concat(fontSizeClass, " ").concat(fontWeightClass, " leading-tight"),
                                                            children: entry.player.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                            lineNumber: 303,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                        lineNumber: 302,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                lineNumber: 284,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, entry.player_id, true, {
                                        fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                        lineNumber: 249,
                                        columnNumber: 21
                                    }, this);
                                }
                                // NORMAL STYLE
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        border: "".concat(rank.borderWidth || 1, "px solid ").concat(isTopThree ? "".concat(borderColorToUse, "40") : 'rgba(255,255,255,0.1)'),
                                        boxShadow: rank.backgroundGlow && isTopThree ? "0 0 ".concat(20 * glowOpacity, "px ").concat(rankColor).concat(Math.round(glowOpacity * 96).toString(16).padStart(2, '0')) : 'none',
                                        backgroundImage: patternBg,
                                        backgroundSize: rank.backgroundPattern === "dots" ? "20px 20px" : rank.backgroundPattern === "grid" ? "20px 20px" : "auto",
                                        ...cardStyleEffects
                                    },
                                    className: "jsx-139433002f4e90f1" + " " + "relative p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] ".concat(animationClass, " ").concat(isTopThree ? "bg-gradient-to-r from-white/10 to-white/5" : "bg-white/5 hover:bg-white/10"),
                                    children: [
                                        rank.animationType === "shine" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                background: "linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)"
                                            },
                                            className: "jsx-139433002f4e90f1" + " " + "absolute inset-0 opacity-20 animate-shine-move"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                            lineNumber: 339,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-139433002f4e90f1" + " " + "absolute top-2 right-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-139433002f4e90f1" + " " + "text-xs text-white/30 font-mono",
                                                children: [
                                                    "#",
                                                    position
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                lineNumber: 349,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                            lineNumber: 348,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-139433002f4e90f1" + " " + "flex items-center gap-4 relative z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-139433002f4e90f1" + " " + "flex-shrink-0 text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                textShadow: rank.textShadow ? "0 0 10px #4ade8080" : 'none'
                                                            },
                                                            className: "jsx-139433002f4e90f1" + " " + "font-bold text-2xl font-mono text-green-400 leading-none",
                                                            children: entry.total_points
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                            lineNumber: 357,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-139433002f4e90f1" + " " + "text-xs text-white/40 uppercase tracking-wider mt-1",
                                                            children: "pts"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                            lineNumber: 365,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-139433002f4e90f1" + " " + "flex-1 min-w-0 pr-6",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            textShadow: rank.textShadow ? "0 0 10px ".concat(rankColor, "40") : 'none'
                                                        },
                                                        className: "jsx-139433002f4e90f1" + " " + "text-white leading-tight ".concat(fontSizeClass, " ").concat(fontWeightClass),
                                                        children: entry.player.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                        lineNumber: 372,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                                    lineNumber: 371,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                            lineNumber: 354,
                                            columnNumber: 21
                                        }, this),
                                        isTopThree && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                background: "radial-gradient(circle at top right, ".concat(rankColor, "80, transparent)")
                                            },
                                            className: "jsx-139433002f4e90f1" + " " + "absolute inset-0 rounded-lg opacity-10 pointer-events-none"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                            lineNumber: 385,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, entry.player_id, true, {
                                    fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                                    lineNumber: 320,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                            lineNumber: 236,
                            columnNumber: 13
                        }, this)
                    ]
                }, rankName, true, {
                    fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
                    lineNumber: 204,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "139433002f4e90f1",
                children: "@keyframes shine-move{0%{transform:translate(-100%)translateY(-100%)rotate(45deg)}to{transform:translate(100%)translateY(100%)rotate(45deg)}}.animate-shine-move.jsx-139433002f4e90f1{animation:3s infinite shine-move}@keyframes shimmer{0%,to{opacity:1}50%{opacity:.5}}.animate-shimmer.jsx-139433002f4e90f1{animation:2s ease-in-out infinite shimmer}@keyframes holographic{0%,to{background-position:0%}50%{background-position:100%}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/LeaderboardTab.tsx",
        lineNumber: 186,
        columnNumber: 5
    }, this);
}
_s(LeaderboardTab, "6qlIci90sG7PNUnc+Yu5twPzc9s=");
_c = LeaderboardTab;
var _c;
__turbopack_context__.k.register(_c, "LeaderboardTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/track-card/TrackCardGoals.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TrackCardGoals": ()=>TrackCardGoals
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$time$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/time.utils.ts [app-client] (ecmascript)");
;
;
function TrackCardGoals(param) {
    let { enrichedTimeGoals, achievedCount, totalCount } = param;
    if (enrichedTimeGoals.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-white/30 text-[10px] text-center py-1",
            children: "No time goals"
        }, void 0, false, {
            fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] text-white/40 uppercase tracking-wider",
                        children: [
                            "Goals ",
                            achievedCount,
                            "/",
                            totalCount
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 h-1 mx-2 bg-white/10 rounded-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full bg-green-400 transition-all duration-500",
                            style: {
                                width: "".concat(achievedCount / totalCount * 100, "%")
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-1 flex-wrap",
                children: enrichedTimeGoals.map((timegoal)=>{
                    const isAchieved = timegoal.is_achieved || false;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "\n                group/goal relative flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium\n                transition-all duration-200\n                ".concat(isAchieved ? 'bg-green-500/30 text-green-300 border border-green-400/50' : 'bg-white/5 text-white/50 border border-white/10', "\n              "),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "uppercase tracking-wide",
                                children: timegoal.name
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                                lineNumber: 61,
                                columnNumber: 15
                            }, this),
                            isAchieved ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-green-400",
                                children: "✓"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                                lineNumber: 66,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white/20",
                                children: "○"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                                lineNumber: 68,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1  bg-black/80 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover/goal:opacity-100 pointer-events-none transition-opacity duration-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col items-center gap-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-white/70",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$time$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["millisecondsToTimeString"])(timegoal.time)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                                                lineNumber: 76,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white/50 text-[9px]",
                                                children: [
                                                    "×",
                                                    timegoal.multiplier.toFixed(1)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                                                lineNumber: 79,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                                        lineNumber: 75,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-full left-1/2 -translate-x-1/2  border-4 border-transparent border-t-black/90"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                                        lineNumber: 83,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                                lineNumber: 71,
                                columnNumber: 15
                            }, this)
                        ]
                    }, timegoal.time_goal_id, true, {
                        fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                        lineNumber: 50,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/track-card/TrackCardGoals.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_c = TrackCardGoals;
var _c;
__turbopack_context__.k.register(_c, "TrackCardGoals");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/TrackCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>TrackCard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$card$2f$dist$2f$chunk$2d$QNLCCAKT$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/card/dist/chunk-QNLCCAKT.mjs [app-client] (ecmascript) <export card_default as Card>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$card$2f$dist$2f$chunk$2d$NDVZOYT4$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_footer_default__as__CardFooter$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/card/dist/chunk-NDVZOYT4.mjs [app-client] (ecmascript) <export card_footer_default as CardFooter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$card$2f$dist$2f$chunk$2d$C6WKGNND$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_header_default__as__CardHeader$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/card/dist/chunk-C6WKGNND.mjs [app-client] (ecmascript) <export card_header_default as CardHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$image$2f$dist$2f$chunk$2d$PGYMO5KK$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__image_default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/image/dist/chunk-PGYMO5KK.mjs [app-client] (ecmascript) <export image_default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$textConverter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/textConverter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$time$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/time.utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$track$2d$card$2f$TrackCardGoals$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/track-card/TrackCardGoals.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function TrackCard(param) {
    let { mappackTrack, timeGoalDefinitions, mappackId, alwaysShowDetails = false } = param;
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { track, timeGoalMappackTrack, personal_best, tier } = mappackTrack;
    const enrichedTimeGoals = timeGoalMappackTrack.map((tgmt)=>{
        const definition = timeGoalDefinitions.find((def)=>def.id === tgmt.time_goal_id);
        return {
            ...tgmt,
            name: (definition === null || definition === void 0 ? void 0 : definition.name) || "Goal ".concat(tgmt.time_goal_id),
            multiplier: (definition === null || definition === void 0 ? void 0 : definition.multiplier) || 0
        };
    }).sort((a, b)=>b.multiplier - a.multiplier);
    const achievedCount = enrichedTimeGoals.filter((tg)=>tg.is_achieved).length;
    const totalCount = enrichedTimeGoals.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$card$2f$dist$2f$chunk$2d$QNLCCAKT$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
        className: "h-50h group transition-transform md:hover:scale-105 duration-300 hover:z-20 transform-gpu overflow-hidden relative",
        shadow: "sm",
        isPressable: true,
        onPress: ()=>router.push("".concat(mappackId, "/").concat(track.id)),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$card$2f$dist$2f$chunk$2d$C6WKGNND$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_header_default__as__CardHeader$3e$__["CardHeader"], {
                className: "absolute z-10 top-0 w-full flex flex-col items-center justify-between bg-transparent group-hover:bg-black/30 group-hover:backdrop-blur-sm transition-all duration-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-white text-xl",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$textConverter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormattedText"], {
                            text: track.name
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/TrackCard.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/TrackCard.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white/30 text-sm",
                        children: track.author
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/TrackCard.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/TrackCard.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$image$2f$dist$2f$chunk$2d$PGYMO5KK$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__image_default__as__Image$3e$__["Image"], {
                removeWrapper: true,
                alt: "Card background",
                className: "z-0 w-full h-full object-cover",
                src: track.thumbnailUrl
            }, void 0, false, {
                fileName: "[project]/src/app/_components/TrackCard.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$card$2f$dist$2f$chunk$2d$NDVZOYT4$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_footer_default__as__CardFooter$3e$__["CardFooter"], {
                className: "\n          absolute bg-black/40 backdrop-blur-sm -bottom-1 left-0 right-0 border-t border-white/10 z-10\n          transition-transform duration-300 ease-in-out pb-2 pt-2\n          ".concat(alwaysShowDetails ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0', "\n        "),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full flex flex-col gap-2 px-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] text-white/40 uppercase tracking-wider",
                                children: !personal_best ? "Map not played yet" : "PB: ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$time$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["millisecondsToTimeString"])(personal_best))
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/TrackCard.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/TrackCard.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$track$2d$card$2f$TrackCardGoals$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrackCardGoals"], {
                            enrichedTimeGoals: enrichedTimeGoals,
                            achievedCount: achievedCount,
                            totalCount: totalCount
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/TrackCard.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/_components/TrackCard.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/_components/TrackCard.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/TrackCard.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(TrackCard, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TrackCard;
var _c;
__turbopack_context__.k.register(_c, "TrackCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/TierSection.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TierSection": ()=>TierSection
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$TrackCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/TrackCard.tsx [app-client] (ecmascript)");
;
;
function TierSection(param) {
    let { tierName, tierData, timeGoals, mappackId, alwaysShowDetails, onRef } = param;
    var _tierData_tier;
    const tierColor = ((_tierData_tier = tierData.tier) === null || _tierData_tier === void 0 ? void 0 : _tierData_tier.color) || "#6b7280";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: onRef,
        "data-tier": tierName,
        className: "scroll-mt-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                className: "border-1 border-white/10 my-2 w-full"
            }, void 0, false, {
                fileName: "[project]/src/app/_components/TierSection.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 pt-4 justify-center items-center flex",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-3xl uppercase tracking-wider text-white/70 font-semibold justify-center uppercase",
                    style: {
                        color: tierColor
                    },
                    children: [
                        tierName.toUpperCase(),
                        " TIER"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/_components/TierSection.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/_components/TierSection.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3",
                children: tierData.tracks.map((mappackTrack)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$TrackCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        mappackTrack: mappackTrack,
                        timeGoalDefinitions: timeGoals,
                        mappackId: mappackId,
                        alwaysShowDetails: alwaysShowDetails
                    }, mappackTrack.track_id, false, {
                        fileName: "[project]/src/app/_components/TierSection.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/_components/TierSection.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/TierSection.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c = TierSection;
var _c;
__turbopack_context__.k.register(_c, "TierSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/_components/MappackContent.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// components/mappack-page/MappackContent.tsx
__turbopack_context__.s({
    "MappackContent": ()=>MappackContent
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$switch$2f$dist$2f$chunk$2d$I3A4XRYQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__switch_default__as__Switch$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/switch/dist/chunk-I3A4XRYQ.mjs [app-client] (ecmascript) <export switch_default as Switch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$RRHVXFLZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tabs_default__as__Tabs$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/tabs/dist/chunk-RRHVXFLZ.mjs [app-client] (ecmascript) <export tabs_default as Tabs>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroui/tabs/dist/chunk-ML27DD5T.mjs [app-client] (ecmascript) <export tab_item_base_default as Tab>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$TrackFilter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/TrackFilter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$LeaderboardTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/LeaderboardTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$TierSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/TierSection.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function MappackContent(param) {
    let { mappack, sortedTiers, tracksByTier, filteredTracks, onFilterChange, onTabChange, tierRefs } = param;
    _s();
    const [alwaysShowTrackDetails, setAlwaysShowTrackDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedTab, setSelectedTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("maps");
    const handleTabChange = (key)=>{
        setSelectedTab(key);
        onTabChange(key);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "lg:col-start-2 lg:col-span-4 col-span-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 mb-4 pt-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$TrackFilter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        timeGoals: mappack.timeGoals,
                        tracks: mappack.MappackTrack,
                        onFilterChange: onFilterChange
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/MappackContent.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$switch$2f$dist$2f$chunk$2d$I3A4XRYQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__switch_default__as__Switch$3e$__["Switch"], {
                        isSelected: alwaysShowTrackDetails,
                        onValueChange: setAlwaysShowTrackDetails,
                        size: "sm",
                        classNames: {
                            wrapper: "group-data-[selected=true]:bg-white bg-neutral-600"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm text-white",
                            children: "Always Show Track Details"
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/MappackContent.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/MappackContent.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/MappackContent.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$RRHVXFLZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tabs_default__as__Tabs$3e$__["Tabs"], {
                selectedKey: selectedTab,
                onSelectionChange: (key)=>handleTabChange(key),
                size: "lg",
                color: "default",
                variant: "underlined",
                classNames: {
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-white/10",
                    cursor: "w-full bg-white",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-white text-white/60 font-semibold text-lg"
                },
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__["Tab"], {
                        title: "Maps",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-8",
                            children: sortedTiers.map((tierName)=>{
                                const tierData = tracksByTier[tierName];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$TierSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TierSection"], {
                                    tierName: tierName,
                                    tierData: tierData,
                                    timeGoals: mappack.timeGoals,
                                    mappackId: mappack.id,
                                    alwaysShowDetails: alwaysShowTrackDetails,
                                    onRef: (el)=>{
                                        tierRefs.current[tierName] = el;
                                    }
                                }, tierName, false, {
                                    fileName: "[project]/src/app/_components/MappackContent.tsx",
                                    lineNumber: 75,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/MappackContent.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this)
                    }, "maps", false, {
                        fileName: "[project]/src/app/_components/MappackContent.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroui$2f$tabs$2f$dist$2f$chunk$2d$ML27DD5T$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__tab_item_base_default__as__Tab$3e$__["Tab"], {
                        title: "Leaderboard",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$LeaderboardTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            mappackId: mappack.id,
                            mappackRanks: mappack.mappackRanks
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/MappackContent.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this)
                    }, "leaderboard", false, {
                        fileName: "[project]/src/app/_components/MappackContent.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/MappackContent.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/MappackContent.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(MappackContent, "ckCY34f7vR23AzQG1Z9s2KB0b/4=");
_c = MappackContent;
var _c;
__turbopack_context__.k.register(_c, "MappackContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/mappacks/[mappack]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/mappack/[mappack]/page.tsx
__turbopack_context__.s({
    "default": ()=>MappackPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mappack$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/mappack.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$mappack$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/mappack.utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTierScroll$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useTierScroll.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$MappackSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/MappackSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$MappackContent$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/MappackContent.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function MappackPage(param) {
    let { params } = param;
    _s();
    const { mappack: mappackId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [mappack, setMappack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [filteredTracks, setFilteredTracks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedTab, setSelectedTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("maps");
    const [isEditOpen, setIsEditOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MappackPage.useEffect": ()=>{
            const fetchMappack = {
                "MappackPage.useEffect.fetchMappack": async ()=>{
                    try {
                        setLoading(true);
                        const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mappack$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mappackService"].getMappack(mappackId, user === null || user === void 0 ? void 0 : user.id);
                        setMappack(data);
                        setFilteredTracks(data.MappackTrack);
                    } catch (error) {
                        console.error("Error fetching mappack:", error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["MappackPage.useEffect.fetchMappack"];
            fetchMappack();
        }
    }["MappackPage.useEffect"], [
        mappackId,
        user === null || user === void 0 ? void 0 : user.id
    ]);
    const tracksByTier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$mappack$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["groupTracksByTier"])(filteredTracks);
    const sortedTiers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$mappack$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortTiersByPoints"])(tracksByTier);
    const { activeTier, tierRefs, scrollToTier } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTierScroll$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTierScroll"])(tracksByTier);
    const handleEditSave = async ()=>{
        try {
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mappack$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mappackService"].getMappack(mappackId, user === null || user === void 0 ? void 0 : user.id);
            setMappack(data);
            setFilteredTracks(data.MappackTrack);
        } catch (error) {
            console.error("Error reloading mappack:", error);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-white text-xl",
                children: "Loading mappack..."
            }, void 0, false, {
                fileName: "[project]/src/app/mappacks/[mappack]/page.tsx",
                lineNumber: 61,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/mappacks/[mappack]/page.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this);
    }
    if (!mappack) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-white text-xl",
                children: "Mappack not found"
            }, void 0, false, {
                fileName: "[project]/src/app/mappacks/[mappack]/page.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/mappacks/[mappack]/page.tsx",
            lineNumber: 68,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid lg:grid-rows-1 lg:grid-cols-6 gap-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:col-start-1 lg:col-span-1 col-span-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$MappackSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MappackSidebar"], {
                    mappack: mappack,
                    sortedTiers: sortedTiers,
                    tracksByTier: tracksByTier,
                    activeTier: activeTier,
                    selectedTab: selectedTab,
                    isEditOpen: isEditOpen,
                    onTierClick: scrollToTier,
                    onEditClick: ()=>setIsEditOpen(true),
                    onEditClose: ()=>setIsEditOpen(false),
                    onEditSave: handleEditSave
                }, void 0, false, {
                    fileName: "[project]/src/app/mappacks/[mappack]/page.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/mappacks/[mappack]/page.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$MappackContent$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MappackContent"], {
                mappack: mappack,
                sortedTiers: sortedTiers,
                tracksByTier: tracksByTier,
                filteredTracks: filteredTracks,
                onFilterChange: setFilteredTracks,
                onTabChange: setSelectedTab,
                tierRefs: tierRefs
            }, void 0, false, {
                fileName: "[project]/src/app/mappacks/[mappack]/page.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/mappacks/[mappack]/page.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_s(MappackPage, "pAPmrny8IyYBQimMsLF0Ctyonqk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTierScroll$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTierScroll"]
    ];
});
_c = MappackPage;
var _c;
__turbopack_context__.k.register(_c, "MappackPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_6c66f388._.js.map