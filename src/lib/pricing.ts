export const PRICING_PLANS = {
    STARTER: {
        name: "Starter",
        priceId: process.env.STRIPE_PRICE_STARTER || "price_1StarterPlaceholder",
        price: "$29"
    },
    GROWTH: {
        name: "Growth",
        priceId: process.env.STRIPE_PRICE_GROWTH || "price_1GrowthPlaceholder",
        price: "$79"
    },
    PRO: {
        name: "Pro",
        priceId: process.env.STRIPE_PRICE_PRO || "price_1ProPlaceholder",
        price: "$149"
    }
};
