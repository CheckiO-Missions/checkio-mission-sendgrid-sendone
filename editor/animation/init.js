//Dont change it
//Dont change it
requirejs(['ext_editor_io', 'jquery_190'],
    function (extIO, $) {
        
        var $tryit;

        var io = new extIO({
            multipleArguments: true,
            functions: {
                js: 'sumTwo',
                python: 'sum_two'
            }
        });
        io.extAnimateSlide = function (this_e, data, options) {
            var $content = this.extSetHtmlSlide(this.getTemplate(this.animationTemplateName)).find('.animation-content');
            console.log(data);
            if (!data) {
                console.log("data is undefined");
                return false;
            }
            if (data.error) {
                $content.find('.call').html('Fail: ' + this.checkioFunction + '(' + this.parseInputArguments(data.in) + ')');
                if (data.error.startsWith('SendGridAuthError:')) {
                    $content.find('.output').html('Wrong SendGrip API Key. You can generate one <a href="https://app.sendgrid.com/settings/api_keys" target="_blank">here</a>');
                } else {
                    $content.find('.output').html(data.error.replace(/\n/g, ","));
                }

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }
            var checkioInput = data.in;
            var rightResult = data.ext?data.ext["answer"]:undefined;
            var userResult = data.out;
            var result = data.ext?data.ext["result"]:undefined;

            $content.find('.output').remove();

            if (result) {
                $content.find('.call').html('Pass: ' + this.checkioFunction + '(' + this.parseInputArguments(checkioInput) + ')');
                $content.find('.answer').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return;
            }

            $content.find('.call').addClass('error');
            $content.find('.call').html('Fail: ' + this.checkioFunction + '(' + this.parseInputArguments(checkioInput) + ')');

            if (typeof userResult === "undefined") {
                this_e.setAnimationHeight($content.height() + 60);
                return;
            }

            var htmlErrors = '';
            if (userResult.length > 1) {
                htmlErrors += '<li> - Only one email should be sent</li>';
            } else {
                if (userResult[0].subject != rightResult[0].subject) {
                    htmlErrors += '<li> - "' + userResult[0].subject + '" is a wrong subject</li>';
                }

                if (userResult[0].content[0].type != 'text/plain') {
                    htmlErrors += '<li> - Content type should be text/plain</li>';
                } else {
                    if (userResult[0].content[0].value != rightResult[0].content[0].value) {
                        htmlErrors += '<li> - Body is wrong. Your is "' + userResult[0].content[0].value + '", ' +
                        'should be "' + rightResult[0].content[0].value + '"</li>';
                    }
                }

                if (userResult[0].personalizations[0].to[0].email != rightResult[0].personalizations[0].to[0].email) {
                    htmlErrors += '<li> - The email was sent to a wrong address</li>';
                }

                if (String(userResult[0].personalizations) != String(rightResult[0].personalizations)) {
                    htmlErrors += '<li> - You send an email to a wrong person</li>';
                }
            }
            $content.find('.answer').addClass('error').html('<ul>' + htmlErrors + '</ul>');
            this_e.setAnimationHeight($content.height() + 60);
        };
        io.start();
    }
);
