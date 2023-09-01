import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoDaoMock } from 'test/mocks/services/dao/info-dao-mock.service';
import { InfoDao } from './daos/info.dao';
import { InfoComponent } from './info.component';
import { throwError } from 'rxjs';

describe('InfoComponent', () => {
    let component: InfoComponent;
    let fixture: ComponentFixture<InfoComponent>;
    let infoDaoMock;

    beforeEach(async () => {
        TestBed.overrideComponent(InfoComponent, {
            set: {
                providers: [{ provide: InfoDao, useClass: InfoDaoMock }],
            },
        });
        await TestBed.configureTestingModule({
            declarations: [InfoComponent],
            providers: [{ provide: InfoDao, useClass: InfoDaoMock }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InfoComponent);
        infoDaoMock = fixture.debugElement.injector.get(InfoDao);
        component = fixture.componentInstance;
    });

    it('should create the info component', () => {
        expect(component).toBeTruthy();
    });

    it('should get server info during ngOnInit', () => {
        const infoDaoSpy = jest.spyOn(infoDaoMock, 'getInfo');
        component.ngOnInit();

        expect(infoDaoSpy).toHaveBeenCalledTimes(1);
    });

    it('test httpError message when getInfo throws error with status zero', () => {
        const error: any = { status: 0, error: '' };
        const spyGetInfo = jest.spyOn(infoDaoMock, 'getInfo').mockReturnValue(throwError(() => error));
        component.ngOnInit();
        expect(spyGetInfo).toHaveBeenCalled();
        expect(component.httpError).toBe(error.error);
    })

    it('test httpError message when getInfo throws error with status not equal to zero', () => {
        const error: any = { status: 400, error: '' };
        const spyGetInfo = jest.spyOn(infoDaoMock, 'getInfo').mockReturnValue(throwError(() => error));
        component.ngOnInit();
        expect(spyGetInfo).toHaveBeenCalled();
        expect(component.httpError).toBe('Unable to process request at this time.');
    })
});