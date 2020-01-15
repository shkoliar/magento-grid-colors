# Magento 2 Grid Colors

## Overview

The module adds extra coloring features to admin grids at the `Sales` section. With help of this module, it is possible to define row color based on any column value which has pre-defined set of values. All coloring is applied dynamically and color configuration can be saved via `Grid Bookmarks` menu same as columns and filters configuration. Colorize grids with ease and preview results instantly!

## Demo

Click to watch the youtube video. `Cmd` + `Click` for macOS or `Crtl` + `Click` for Windows to open video in a new tab.

[![Watch the video](https://img.youtube.com/vi/eJ1ZgUQ_S4U/maxresdefault.jpg)](https://youtu.be/eJ1ZgUQ_S4U)

## Installation

To install the Magento 2 Grid Colors module, simply run the command below:

```bash
composer require shkoliar/magento-grid-colors
```

To enable the module:

```bash
bin/magento module:enable Shkoliar_GridColors
```

## Usage 

After the module is installed and enabled, look for a new `Colors` element at `Grid Actions` section of `Orders`, `Invoices`, `Shipments` or `Credit Memos` pages of `Sales` section. To save the state of configured colors use `Grid Bookmarks` (Views) menu.