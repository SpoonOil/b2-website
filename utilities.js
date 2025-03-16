export default class ApiUtilities {
    /**
     * Returns an object with the current active leaderboard, or the most recent one if none are active.
     * The object also includes whether a leaderboard is active or not.
     * @param {Array} homs - the homs array from the api
     * @returns {Object} {lb: leaderboard object, liveLbExists: boolean}
     */
    static getActiveLeaderboard(homs) {
        let activeLeaderboard = homs.find(hom => hom.live === true);
        let isLive = true;
        if (!activeLeaderboard) {
            activeLeaderboard = homs[0];
            isLive = false;
        }
        return {activelb: activeLeaderboard, liveLbExists: isLive};
    }
}