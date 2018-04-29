# StatamiC  URLs

Provides incredibly simple Statamic collection utility commands when editing Statamic collection files.

## Known Limitations

* Currently, this extension only works with Statamic collections.

## Features

Within the Command Pallete, the following features are available:

* Copy Statamic Slug: Copies the Statamic collection URL for the current open document to the clipboard.
* Copy Statmaic Slug and Title: Copies the Statamic collection Title and URL for the current open document in Markdown format to the clipboard
* View Statamic Page in Browser: Appends the URL for the Statamic Collection URL, based on the current open document, and the configured Statamic base URL, and opens it in the browser.

## Extension Settings

The `View Statamic Page in Browser` functionality requires that you configure your workspace settings similar to the following:

```json
{
  "statamic.url": "https://stillat.com/"
}
```

Just replace `https://stillat.com/` with your websites base URL. You can ommit the final `/` if you'd like, it will be removed automatically if it's included.