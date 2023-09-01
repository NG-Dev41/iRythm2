import { Observable, of } from 'rxjs';

export class TranslateServiceMock {

    public setDefaultLang(lang: string): void {
    }

    public getDefaultLang(): string {
        return '';
    }

    public use(lang: string): Observable<any> {
        return of ('');
    }

    /**
     * Gets an object of translations for a given language with the current loader
     */
    public getTranslation(lang: string): Observable<any> {
        return of('');
    }

    /**
     * Manually sets an object of translations for a given language,
     * set shouldMerge to true if you want to append the translations instead of replacing them
     */
    public setTranslation(lang: string, translations: object, shouldMerge: boolean = false): void {
    }


    /**
     * Add new langs to the list
     */
    public addLangs(langs: Array<string>): void {
    }

    /**
     * Returns an array of currently available langs
     */
    public getLangs(): Array<string> {
        return [''];
    }

    /**
     *  Gets the translated value of a key (or an array of keys) or the key if the value was not found
     */
    public get(key: string | Array<string>, interpolateParams ?: object): Observable<string | object> {
        return of('');
    }

    /**
     *  Returns a stream of translated values of a key (or an array of keys)
     *  or the key if the value was not found. Without any onTranslationChange
     *  events this returns the same value as get but it will also emit new values whenever the translation changes.
     */
    public getStreamOnTranslationChange(key: string | Array<string>, interpolateParams ?: object): Observable<string | object> {
        return of('');
    }

    /**
     * Returns a stream of translated values of a key (or an array of keys)
     * or the key if the value was not found. Without any onLangChange events
     * this returns the same value as get but it will also emit new values whenever the used language changes.
     */
    public stream(key: string | Array<string>, interpolateParams ?: object): Observable<string | object> {
        return of('');
    }

    /**
     * Gets the instant translated value of a key (or an array of keys).
     * /!\ This method is synchronous and the default file loader is asynchronous.
     * You are responsible for knowing when your translations have been loaded and it is safe to use this method.
     * If you are not sure then you should use the get method instead
     */
    public instant(key: string | Array<string>, interpolateParams ?: object): string | object {
        return '';
    }

    /**
     * Sets the translated value of a key
     */
    public set(key: string, value: string, lang ?: string): void {
    }

    /**
     * Calls resetLang and retrieves the translations object for the current loader
     */
    public reloadLang(lang: string): Observable<string | object> {
        return of('');
    }

    /**
     * Removes the current translations for this lang.
     * /!\ You will have to call use, reloadLang or getTranslation again to be able to get translations
     */
    public resetLang(lang: string): void {
    }

    /**
     * Returns the current browser lang if available, or undefined otherwise
     */
    public getBrowserLang(): string | undefined {
        return '';
    }

    /**
     * Returns the current browser culture language name (e.g. "de-DE" if available, or undefined otherwise
     */
    public getBrowserCultureLang(): string | undefined {
        return '';
    }

}
