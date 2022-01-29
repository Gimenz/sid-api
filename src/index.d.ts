import { EditProfile, IDashboard, IFetchedLinks, IHeaders, ILinkStatistics, IShortedLink, ITopLinks, IUserModel } from "./type/typing";

/**
 * @class s.id url shortener
 */
declare class SID {
    private credentials;
    constructor(email: string, password: string)

    private headers;
    private cookiePath;
    private isCookieExists();
    private readCookie();
    private useExistCookie();
    private makeRequest();
    /**
     * get token, and saved automatically
     * @param {string} email 
     * @param {string} password 
     * @returns 
     */
    public getToken(email?: string, password?: string): Promise<IHeaders>

    /**
     * shorten an url
     * @returns 
     */
    public short(url: string): Promise<IShortedLink>

    /**
     * user profile
     * @returns 
     */
    public user(): Promise<IUserModel>
    
    /**
     * dashboard
     * @returns 
     */
    public dashboard(): Promise<IDashboard>    

    /**
     * most visited urls
     * @returns 
     */
    public topLinks(): Promise<ITopLinks>
    
    /**
     * check link stats
     * @returns 
     */
    public linkStatus(id: string | number): Promise<ILinkStatistics>

    /**
     * edit profile
     * @returns 
     */
    public editProfile(options: EditProfile): Promise<IUserModel>    

    /**
     * fetch shortened links
     * @param page page number
     */
    public fetchLinks(page: number): Promise<IFetchedLinks>
    
}