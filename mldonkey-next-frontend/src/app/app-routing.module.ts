import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './private/home/home.component'

const routes: Routes = [
    {
        path: "",
        loadChildren: () => import("./public/public.module").then(m => m.PublicModule)
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "home",
        component: HomeComponent
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
