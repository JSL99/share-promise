import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_ICONS } from 'ng-zorro-antd';

import { AppComponent } from './app.component';
import { AppRouterModule } from './app-router.modules';

import { NewPromiseComponent } from './pages/new-promise/new-promise.component';
import { PromiseService } from './pages/new-promise/new-promise.service';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    NewPromiseComponent,
  ],
  imports: [
    NgZorroAntdModule,
    BrowserModule,
    AppRouterModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
