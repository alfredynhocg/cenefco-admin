import { Routes } from "@angular/router";
import { Ecommerce } from "../../dashboard/presentation/ecommerce/ecommerce";

export const DASHBOARDS_ROUTES: Routes = [
    {
        path: 'dashboards/senefco',
        component: Ecommerce,
        data: { title: 'Dashboard' },
    }
]
