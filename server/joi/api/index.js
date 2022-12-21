import createUserJoi from "./user/createUser.joi.js"
import loginUserJoi from "./user/loginUser.joi.js"
import investmentJoi from "./executiveSummary/investment.js"
import demographicJoi from "./executiveSummary/demographic.js"
import propertySummaryJoi from "./propertyDescription/propertySummary.js"
import communityFeatureJoi from "./propertyDescription/communityFeature.js"
import unitFeaturejoi from "./propertyDescription/unitFeatures.js"
import floorPlanjoi from "./propertyDescription/floorPlans.js"
import compsjoi from "./propertyDescription/comps.js"
import locationSummaryJoi from "./locationOverview/locationSummary.js"
import employersJoi from "./locationOverview/employers.js"
import financialSummaryJoi from "./financialSummary/financialSummary.js"
import sourceFundJoi from "./financialSummary/sourceFund.js"
import closingCapitalJoi from "./financialSummary/closingCapital.js"
import debtAssumptionJoi from "./financialSummary/debtAssumption.js"
import performaJoi from "./financialSummary/performa.js"
import refinanceJoi from "./exitScenario/refinance.js"
import saleScenarioJoi from "./exitScenario/saleScenario.js"
import aboutJoi from "./about.js"

export default {
    createUserJoi, loginUserJoi, investmentJoi, demographicJoi,
    propertySummaryJoi, communityFeatureJoi, unitFeaturejoi,
    floorPlanjoi, compsjoi, locationSummaryJoi, employersJoi,
    financialSummaryJoi, performaJoi, refinanceJoi, saleScenarioJoi,
    sourceFundJoi, closingCapitalJoi, debtAssumptionJoi, aboutJoi
}
