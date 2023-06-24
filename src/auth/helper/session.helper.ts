import { parse } from "next-useragent";
import * as geoip from 'geoip-lite';

//ORM Entity
import { Session } from "@/user/model/session.entity";

export const checkSession = (session: Session, ip: string, agent: string) => {
    const user_agent = parse(agent);
    const address = geoip.lookup(ip);
    let matchingFields = 0;

    if (session.browser === user_agent.browser) {
        matchingFields++
    }
    if (session.os === user_agent.os) {
        matchingFields++
    }
    if (session.osVersion === user_agent.osVersion.toString()) {
        matchingFields++
    }
    if (session.device === user_agent.deviceType) {
        matchingFields++
    }
    if (session.area === (address?.city || null)) {
        matchingFields++
    }
    if (matchingFields >= 4) {
        return true;
    } else {
        return false;
    }
}