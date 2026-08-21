/**
 * The lab renders a real post, so it has to render it under the same layout the
 * real route uses — that is where `data-voice="author"` and the serif face are
 * unlocked. Re-exported rather than copied: a lab whose typography has drifted
 * from the post page is judging the wrong page.
 */
export { default } from "../../blog/[slug]/layout";
