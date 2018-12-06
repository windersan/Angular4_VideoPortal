"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var login_component_1 = require("./login.component");
// Observable class extensions
require("rxjs/add/observable/of");
// Observable operators
require("rxjs/add/operator/catch");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/distinctUntilChanged");
var fixture;
describe('Login component', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({ declarations: [login_component_1.LoginComponent] });
        fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        fixture.detectChanges();
    });
    it('should display a title', testing_1.async(function () {
        var titleText = fixture.nativeElement.querySelector('h1').textContent;
        expect(titleText).toEqual('CROSSOVER');
    }));
});
//# sourceMappingURL=login.component.spec.js.map