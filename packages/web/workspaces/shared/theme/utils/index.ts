import {colors, fills} from '../foundational-styles'
import {fontFamilies, headings, paragraph, text} from '../typography'

const themedProperty = (object, keyOrValue) => {
  if (Object.prototype.hasOwnProperty.call(object, keyOrValue)) {
    return object[keyOrValue]
  }

  return keyOrValue
}

export const getTextColor = color => {
  return themedProperty(colors.text, color)
}

export const getLinkColor = color => {
  return themedProperty(colors.link, color)
}

export const getLinkFocusColor = color => {
  const opt = {
    default: fills.subtle.blue,
    info: fills.subtle.blue,
    neutral: fills.subtle.neutral,
    success: fills.subtle.green,
    warning: fills.subtle.orange,
    danger: fills.subtle.red,
  }[color]

  return `
    color: ${opt.color};
    background-color: ${opt.backgroundColor};
  `
}

export const getFontFamily = fontFamily => {
  return themedProperty(fontFamilies, fontFamily)
}

export const getHeadingStyle = style => {
  return themedProperty(headings, style)
}

export const getTextStyle = style => {
  return themedProperty(text, style)
}

export const getParagraphStyle = style => {
  return themedProperty(paragraph, style)
}
