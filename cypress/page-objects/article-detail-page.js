import ArticlesApi from "../api-utils/article-api";

// data-testId attributes
const COMMENT_TEXTAREA = "comment-textarea";
const POST_COMMENT_BUTTON = "post-comment";
const COMMENT_CARD = "comment-card";
const COMMENT_TEXT = "comment-content";
const COMMENT_AUTHOR = "author-username";
const DELETE_COMMENT_BUTTON = "delete-comment";
const TAG_PILLS = "article-tag";
const EDIT_ARTICLE = "edit-article";
const DELETE_ARTICLE = "delete-article";

export default class ArticleDetailPage {
  static visit(articleIndex = 0) {
    let slug = "";
    ArticlesApi.getArticles()
      .then((articles) => {
        slug = articles[articleIndex].slug;
      })
      .then(() => {
        cy.visit(`/article/${slug}`);
      });
  }

  static sendComment(comment) {
    cy.getByTestId(COMMENT_TEXTAREA).type(comment);
    cy.getByTestId(POST_COMMENT_BUTTON).click();
  }

  static getCommentCardByText(commentText) {
    return cy.getByTestId(COMMENT_CARD).filter(`:contains(${commentText})`);
  }

  static getCommentText() {
    return cy.getByTestId(COMMENT_TEXT);
  }

  static getCommentAuthor() {
    return cy.getByTestId(COMMENT_AUTHOR);
  }

  static deleteComment(commentText) {
    this.getCommentCardByText(commentText)
      .within(() => {
        cy.getByTestId(DELETE_COMMENT_BUTTON).click();
      });
  }

  static getArticleTags() {
    return cy.getByTestId(TAG_PILLS).map("textContent").mapInvoke("trim");
  }

  static getArticleBody() {
    return cy.get("p");
  }

  static goToEditArticle() {
    cy.getByTestId(EDIT_ARTICLE).first().click();
    cy.url().should("include", "editor");
  }

  static deleteArticle() {
    cy.getByTestId(DELETE_ARTICLE).first().click();
  }
}
