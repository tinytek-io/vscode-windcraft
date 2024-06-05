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

### 0.0.5

* Fixes issue on WSL where the extension was not working due to timeouts while waiting for the TypeScript Language Server Plugin to start - this has been fixed by increasing the attempts to connect to the server and wait for vs to start up.

### Next Release

* Add preview mode to see the changes in real-time
* Add tooltips on all buttons and inputs to help users understand what each button does
* Improve accessibility and usability of the editor
* Add support for design system tokens

---

## For more information

* [WindCraft Repository](https://github.com/tinytek-io/windcraft)

**Enjoy!**
