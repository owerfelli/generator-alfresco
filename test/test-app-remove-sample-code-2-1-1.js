'use strict';
/* eslint-env node, mocha */
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const os = require('os');
const path = require('path');

describe('generator-alfresco:app-remove-sample-code-2-1-1', function () {
  describe('remove sdk sample code', function () {
    this.timeout(60000);

    const osTempDir = path.join(os.tmpdir(), './temp-test');

    before(function () {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .inDir(osTempDir)
        .withOptions({'skip-install': false})
        .withPrompts({
          sdkVersion: '2.1.1',
          projectStructure: 'basic',
          removeDefaultSourceAmps: false,
          removeDefaultSourceSamples: true,
        })
        .toPromise();
    });

    it('creates a project', function () {
      assert.file(path.join(osTempDir, '.yo-rc.json'));
    });

    describe('remove sdk sample code again', function () {
      before(function () {
        return helpers.run(path.join(__dirname, '../generators/app'))
          .cd(osTempDir)
          .withLocalConfig({
            archetypeVersion: '2.1.1',
            projectStructure: 'basic',
            removeDefaultSourceAmps: false,
            removeDefaultSourceSamples: true,
          })
          .withOptions({'skip-install': false})
          .toPromise();
      });

      it('removes demo files', function () {
        assert.noFile([
          // This list is representative, it is not a complete list of items that are removed
          'repo-amp/src/main/java/org/alfresco/demoamp/Demo.java',
          'repo-amp/src/test/java/org/alfresco/demoamp/test/DemoComponentTest.java',
        ]);
      });

      it('deletes sample files', function () {
        assert.noFile([
          'repo-amp/src/main/amp/web/css/demoamp.css',
          'repo-amp/src/main/amp/web/jsp/demoamp.jsp',
          'repo-amp/src/main/amp/web/scripts/demoamp.js',
          'repo-amp/src/main/amp/config/alfresco/extension/templates/webscripts/helloworld.get.desc.xml',
          'repo-amp/src/main/amp/config/alfresco/extension/templates/webscripts/helloworld.get.html.ftl',
          'repo-amp/src/main/amp/config/alfresco/extension/templates/webscripts/helloworld.get.js',
          'repo-amp/src/main/amp/config/alfresco/module/repo-amp/webscripts/helloworld.get.js',
          'repo-amp/src/main/amp/config/alfresco/module/repo-amp/context/bootstrap-context.xml',
          'repo-amp/src/main/amp/config/alfresco/module/repo-amp/context/service-context.xml',
          'repo-amp/src/main/amp/config/alfresco/module/repo-amp/context/webscript-context.xml',
          'repo-amp/src/main/amp/config/alfresco/module/repo-amp/model/content-model.xml',
          'repo-amp/src/main/amp/config/alfresco/module/repo-amp/model/workflow-model.xml',
        ].map(relativePath => path.join('repo-amp/src/main/amp', relativePath)));

        assert.noFile([
          'repo-amp/src/main/java/org/alfresco/demoamp/Demo.java',
          'repo-amp/src/main/java/org/alfresco/demoamp/DemoComponent.java',
          'repo-amp/src/main/java/org/alfresco/demoamp/HelloWorldWebScript.java',
          'repo-amp/src/test/java/org/alfresco/demoamp/test/DemoComponentTest.java',
        ].map(relativePath => path.join('repo-amp/src', relativePath)));
      });

      it('creates files to protect some directories', function () {
        assert.file([
          'repo-amp/src/main/amp/config/alfresco/module/repo-amp/context/generated/README.md',
          'repo-amp/src/main/amp/config/alfresco/extension/templates/webscripts/EMPTY.txt',
        ]);
      });
      it('rename slingshot context to *.sample', function () {
        assert.noFile([
          'share-amp/src/main/amp/config/alfresco/web-extension/share-amp-slingshot-application-context.xml',
        ]);
        assert.file([
          'share-amp/src/main/amp/config/alfresco/web-extension/share-amp-slingshot-application-context.xml.sample',
        ]);
      });
    });
  });
});

// vim: autoindent expandtab tabstop=2 shiftwidth=2 softtabstop=2
