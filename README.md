<img src="docs/images/logo/windcraft-logo-text.webp">

# WindCraft

WindCraft is a small tool for visually editing Tailwind CSS classes. It aims to provide a simple and intuitive way to create Tailwind CSS classes without having to remember all the class names or managing the long class names.

## Features

![Flex Layout](docs/images/feature/windcraft-01.gif)

> Tip: Tailwind CSS classes are added to the element as you edit the properties. You can see the classes added in the class attribute of the element.

## Requirements

This extension depends on Tailwind CSS v4.x

## Extension Settings

This extension contributes the following settings:

* `windcraft.themeFile`: Tailwind CSS theme css file path. *(Defaults to project `main.css` or the Tailwind CSS `theme.css` package file)*

## Known Issues

* Currently might add more styles than needed - working on a way to reduce the number of classes added
* Performance / Accessibility / Usability improvements in planned

## Release Notes

Preview release of WindCraft - a visual Tailwind CSS editor.

### 0.0.1

Initial release of the extension! 🚀

Sections added:
* Dynamics - for state modifiers like device modes / theme mode / hover / focus / active / disabled etc.
* Element - for element properties like position / size / rotation / border / overflow etc.
* Flex Layout - for flexbox layout properties
* Layer - Mex Blend  / Opacity / Visibility
* Constraints - for layout top / bottom / left / right / center etc. for positioning elements
* Text - for text properties like font size / font weight / font style / text color etc.
* Background - for background properties like background color
* Border - for border properties like border color / border width / border radius etc.
* Layer Effects - for shadow / blur / spread / opacity / color etc.
* Backdrop Effects - for shadow / blur / spread / opacity / color etc.

Added debug mode 🐞 adding red outline on the element

### Next Release

* Iron out more bugs
* Add support for design system tokens
* Improve accessibility
* Improve performance
* Improve the class names added to the element

---

## For more information

* [WindCraft Repository](https://github.com/tinytek-io/windcraft)

**Enjoy!**
