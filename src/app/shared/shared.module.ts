import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxSpinnerModule } from "ngx-spinner";
import { CabecalhoComponent } from "src/app/shared/componentes/cabecalho/cabecalho.component";
import { MensagemComponent } from "src/app/shared/componentes/mensagem/mensagem.component";

@NgModule({
    declarations: [
        CabecalhoComponent,
        MensagemComponent
    ],
    imports: [
        CommonModule, 
        NgxSpinnerModule.forRoot({ type: 'ball-spin' })
    ],
    exports: [
        CabecalhoComponent,
        MensagemComponent
    ],
})
export class SharedModule { }