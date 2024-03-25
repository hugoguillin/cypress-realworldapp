import Utils from "../utils/utils";
import ArticlesApi from "../api-utils/article-api";
import FavoritesApi from "../api-utils/favorites-api";
import UserDetailsPage from "../page-objects/user-details-page";
import GlobalFeedPage from "../page-objects/global-feed-page";

describe("Check user detail page", { tags: "@user" }, () => {
  before(() => {
    cy.setJwtTokenAsEnv(Cypress.env("email"), Cypress.env("password"));
  });
  beforeEach(() => {
    cy.loginWithSession(Cypress.env("email"), Cypress.env("password"));
    UserDetailsPage.visit();
  });

  it("Check settings button has correct link", () => {
    UserDetailsPage.goToSettingsButton().should(
      "have.attr",
      "href",
      "#/settings"
    );
  });

  context("Check user articles", () => {
    before(() => {
      // Let's make sure user has at least 5 articles
      for (let i = 0; i < 5; i++) {
        let newArticle = Utils.generateNewArticleData();
        ArticlesApi.createNewArticle(newArticle);
      }
    });
    it("Expected user articles are displayed", () => {
      UserDetailsPage.myArticles().should("have.class", "active");
      ArticlesApi.getArticlesByAuthor(Cypress.env("username")).as(
        "articlesBack"
      );
      GlobalFeedPage.getArticlesTitles().then((titles) => {
        cy.get("@articlesBack").then((articles) => {
          expect(titles).to.deep.members(
            articles.map((article) => article.title)
          );
        });
      });
    });
  });

  context("Check user favorited articles", () => {
    before(() => {
      // In order for the test to be deterministic, first we need to unfavorite all articles
      FavoritesApi.getUserFavorites(Cypress.env("username")).then(
        (articles) => {
          articles.forEach((article) => {
            cy.request({
              method: "DELETE",
              url: `${Cypress.env("apiUrl")}/articles/${article.slug}/favorite`,
              headers: {
                Authorization: "Token " + Cypress.env("token"),
              },
            });
          });
        }
      );

      // Then, let's favorite 5 articles
      ArticlesApi.getArticles().then((articles) => {
        const randomArticles = Cypress._.sampleSize(articles, 5);
        randomArticles.forEach((article) => {
          FavoritesApi.favoriteArticle(article.slug);
        });
      });
    });

    it("Expected user favorited articles are displayed", () => {
      UserDetailsPage.favoritedArticles().click();
      FavoritesApi.getUserFavorites(Cypress.env("username")).as(
        "favoritesBack"
      );
      GlobalFeedPage.getArticlesTitles().then((titles) => {
        cy.get("@favoritesBack").then((articles) => {
          expect(titles).to.deep.members(
            articles.map((article) => article.title)
          );
        });
      });
    });
  });
});