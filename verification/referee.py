"""
CheckiOReferee is a base referee for checking you code.
    arguments:
        tests -- the dict contains tests in the specific structure.
            You can find an example in tests.py.
        cover_code -- is a wrapper for the user function and additional operations before give data
            in the user function. You can use some predefined codes from checkio.referee.cover_codes
        checker -- is replacement for the default checking of an user function result. If given, then
            instead simple "==" will be using the checker function which return tuple with result
            (false or true) and some additional info (some message).
            You can use some predefined codes from checkio.referee.checkers
        add_allowed_modules -- additional module which will be allowed for your task.
        add_close_builtins -- some closed builtin words, as example, if you want, you can close "eval"
        remove_allowed_modules -- close standard library modules, as example "math"

checkio.referee.checkers
    checkers.float_comparison -- Checking function fabric for check result with float numbers.
        Syntax: checkers.float_comparison(digits) -- where "digits" is a quantity of significant
            digits after coma.

checkio.referee.cover_codes
    cover_codes.unwrap_args -- Your "input" from test can be given as a list. if you want unwrap this
        before user function calling, then using this function. For example: if your test's input
        is [2, 2] and you use this cover_code, then user function will be called as checkio(2, 2)
    cover_codes.unwrap_kwargs -- the same as unwrap_kwargs, but unwrap dict.

"""

SENDGRID_COVER = '''
import sendgrid
try:
    import sendgrid.cio as cio
except ImportError:
    import cio
cio.set_testing_mode()


def cover(func, in_data):
    mock = cio.MockSimple(sendgrid.Response(200, """Server: nginx
    Date: Mon, 03 Apr 2017 14:43:27 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    Connection: close
    X-Message-Id: wvYdP5GWR9aF5cneTovlHA
    X-Frame-Options: DENY
    Access-Control-Allow-Origin: https://sendgrid.api-docs.io
    Access-Control-Allow-Methods: POST
    Access-Control-Allow-Headers: Authorization, Content-Type, On-behalf-of, x-sg-elas-acl
    Access-Control-Max-Age: 600
    X-No-CORS-Reason: https://sendgrid.com/docs/Classroom/Basics/API/cors.html
    """, ''))
    cio.set_mock('/mail/send', mock)

    func(*in_data)
    ret = mock.requests_data()
    if ret and 'from' in ret[0]:
        ret[0].pop('from')
        return ret
    return ret
'''

from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.io import CheckiOReferee
from checkio.referees import cover_codes

from tests import TESTS

api.add_listener(
    ON_CONNECT,
    CheckiOReferee(
        tests=TESTS,
        function_name={
            "python": "send_email"
        },
        cover_code={
            'python-27': SENDGRID_COVER,
            'python-3': SENDGRID_COVER
        }
    ).on_ready)
