import { SiteHeader } from "../../../../shared/site-chrome/SiteHeader";
import { observePricingLanguage } from "./pricing-language";
export function Header() { return <SiteHeader page="pricing" onLanguageChange={observePricingLanguage} />; }
